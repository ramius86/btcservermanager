package signature

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const bikeyExt = ".bikey"

// ModSignatureStatus defines the verification status for a mod or PBO.
type ModSignatureStatus string

const (
	StatusValid             ModSignatureStatus = "VALID"
	StatusWarning           ModSignatureStatus = "WARNING"
	StatusError             ModSignatureStatus = "ERROR"
	StatusNoBikey           ModSignatureStatus = "NO_BIKEY"
	StatusMissingSignatures ModSignatureStatus = "MISSING_SIGNATURES"
	StatusKeyExtracted      ModSignatureStatus = "KEY_EXTRACTED"
)

// PboVerificationResult contains the status of a single PBO file.
type PboVerificationResult struct {
	PboPath             string             `json:"pboPath"` // Relative path within mod, e.g. "addons/cpx_main.pbo"
	HasBisign           bool               `json:"hasBisign"`
	BisignFiles         []string           `json:"bisignFiles"`                   // Names of found .bisign files
	MatchingBikey       string             `json:"matchingBikey"`                 // Name of matched .bikey file, e.g. "cpx_1.4.0.bikey"
	KeyExtracted        bool               `json:"keyExtracted"`                  // True if key was automatically extracted from .bisign and verified
	KeyExtractionFailed bool               `json:"keyExtractionFailed,omitempty"` // True if key was extracted from .bisign but signature failed against PBO
	Status              ModSignatureStatus `json:"status"`                        // VALID, WARNING, ERROR
	ErrorMessage        string             `json:"errorMessage,omitempty"`
}

// ModSignatureReport contains the full signature check report for a mod.
type ModSignatureReport struct {
	ModID                int64                   `json:"modId"`
	ModName              string                  `json:"modName"`
	OverallStatus        ModSignatureStatus      `json:"overallStatus"`
	TotalPBOs            int                     `json:"totalPbos"`
	VerifiedPBOs         int                     `json:"verifiedPbos"`
	KeysFound            []string                `json:"keysFound"`
	KeysExtracted        []string                `json:"keysExtracted"`
	KeysExtractionFailed []string                `json:"keysExtractionFailed,omitempty"`
	PboResults           []PboVerificationResult `json:"pboResults"`
	Summary              string                  `json:"summary"`
}

type candidateKeyInfo struct {
	key        *BIPublicKey
	bisignPath string
}

type keyRegistry struct {
	knownKeys     map[string]*BIPublicKey
	keyList       []*BIPublicKey
	candidateKeys map[string]*candidateKeyInfo
	modKeysDir    string
	serverKeysDir string
	autoExtract   bool
}

// VerifyModSignatures scans a mod directory, verifies all PBOs against .bisign signatures and .bikey keys.
// If autoExtractMissingKeys is true and a mod has .bisign files but lacks the corresponding .bikey,
// it extracts the public key from the .bisign into the mod's keys directory and serverKeysDir.
func VerifyModSignatures(modDir, serverKeysDir string, autoExtractMissingKeys bool) (*ModSignatureReport, error) {
	if _, err := os.Stat(modDir); os.IsNotExist(err) {
		return nil, fmt.Errorf("mod directory does not exist: %s", modDir)
	}

	report := &ModSignatureReport{
		OverallStatus: StatusValid,
		KeysFound:     []string{},
		KeysExtracted: []string{},
		PboResults:    []PboVerificationResult{},
	}

	reg := initKeyRegistry(modDir, serverKeysDir, autoExtractMissingKeys, report)
	pboPaths := discoverPBOs(modDir)
	report.TotalPBOs = len(pboPaths)

	if len(pboPaths) == 0 {
		report.OverallStatus = StatusValid
		report.Summary = "No PBO files found in mod directory"
		return report, nil
	}

	var (
		errorCount   int
		warningCount int
		hasExtracted bool
	)

	for _, pboPath := range pboPaths {
		res, extracted := verifySinglePbo(pboPath, modDir, reg, report)
		report.PboResults = append(report.PboResults, res)
		if extracted {
			hasExtracted = true
		}
		switch res.Status {
		case StatusValid:
			report.VerifiedPBOs++
		case StatusError:
			errorCount++
		default:
			warningCount++
		}
	}

	compileOverallStatus(report, errorCount, warningCount, hasExtracted)
	return report, nil
}

func initKeyRegistry(modDir, serverKeysDir string, autoExtract bool, report *ModSignatureReport) *keyRegistry {
	reg := &keyRegistry{
		knownKeys:     make(map[string]*BIPublicKey),
		candidateKeys: make(map[string]*candidateKeyInfo),
		modKeysDir:    filepath.Join(modDir, "keys"),
		serverKeysDir: serverKeysDir,
		autoExtract:   autoExtract,
	}

	_ = filepath.Walk(modDir, func(p string, info os.FileInfo, err error) error {
		if err == nil && !info.IsDir() && strings.HasSuffix(strings.ToLower(p), bikeyExt) {
			k, err := ParseBIPublicKeyFile(p)
			if err == nil {
				reg.knownKeys[strings.ToLower(k.Name)] = k
				reg.keyList = append(reg.keyList, k)
				report.KeysFound = append(report.KeysFound, filepath.Base(p))
			}
		}
		return nil
	})

	if serverKeysDir != "" {
		_ = filepath.Walk(serverKeysDir, func(p string, info os.FileInfo, err error) error {
			if err == nil && !info.IsDir() && strings.HasSuffix(strings.ToLower(p), bikeyExt) {
				k, err := ParseBIPublicKeyFile(p)
				if err == nil {
					lowerName := strings.ToLower(k.Name)
					if _, exists := reg.knownKeys[lowerName]; !exists {
						reg.knownKeys[lowerName] = k
						reg.keyList = append(reg.keyList, k)
					}
				}
			}
			return nil
		})
	}

	return reg
}

func discoverPBOs(modDir string) []string {
	var pboPaths []string
	_ = filepath.Walk(modDir, func(p string, info os.FileInfo, err error) error {
		if err == nil && !info.IsDir() && strings.HasSuffix(strings.ToLower(p), ".pbo") {
			pboPaths = append(pboPaths, p)
		}
		return nil
	})
	return pboPaths
}

func findBisignsForPbo(pboPath string) []string {
	pboDir := filepath.Dir(pboPath)
	pboBase := filepath.Base(pboPath)
	bisigns := []string{}
	entries, err := os.ReadDir(pboDir)
	if err != nil {
		return bisigns
	}

	prefix := strings.ToLower(pboBase) + "."
	for _, entry := range entries {
		ename := entry.Name()
		lowerEname := strings.ToLower(ename)
		if strings.HasPrefix(lowerEname, prefix) && strings.HasSuffix(lowerEname, ".bisign") {
			bisigns = append(bisigns, ename)
		}
	}
	return bisigns
}

func (r *keyRegistry) matchOrPrepareCandidateKey(sig *BISign, bPath string) (*BIPublicKey, bool, error) {
	for _, k := range r.keyList {
		if k.Matches(sig) {
			return k, false, nil
		}
	}

	if !r.autoExtract {
		return nil, false, nil
	}

	lowerSigName := strings.ToLower(sig.Name)
	if existing, found := r.candidateKeys[lowerSigName]; found {
		return existing.key, true, nil
	}

	_, bikeyBytes, err := ExtractBiKeyFromBiSign(bPath)
	if err != nil {
		return nil, false, err
	}

	k, err := ParseBIPublicKey(bytes.NewReader(bikeyBytes))
	if err != nil || !k.Matches(sig) {
		return nil, false, fmt.Errorf("extracted candidate key does not match signature header: %w", err)
	}

	r.candidateKeys[lowerSigName] = &candidateKeyInfo{
		key:        k,
		bisignPath: bPath,
	}

	return k, true, nil
}

func (r *keyRegistry) saveConfirmedKey(k *BIPublicKey, bPath string, report *ModSignatureReport) {
	lowerName := strings.ToLower(k.Name)
	keyFileName := k.Name + bikeyExt

	for _, existing := range r.keyList {
		if strings.EqualFold(existing.Name, k.Name) {
			return
		}
	}

	_, _ = SaveExtractedBiKey(bPath, r.modKeysDir)
	if r.serverKeysDir != "" {
		_, _ = SaveExtractedBiKey(bPath, r.serverKeysDir)
	}

	r.keyList = append(r.keyList, k)
	r.knownKeys[lowerName] = k

	found := false
	for _, ek := range report.KeysExtracted {
		if strings.EqualFold(ek, keyFileName) {
			found = true
			break
		}
	}
	if !found {
		report.KeysExtracted = append(report.KeysExtracted, keyFileName)
	}
}

func addUnique(list *[]string, val string) {
	for _, item := range *list {
		if strings.EqualFold(item, val) {
			return
		}
	}
	*list = append(*list, val)
}

func verifySinglePbo(pboPath, modDir string, reg *keyRegistry, report *ModSignatureReport) (PboVerificationResult, bool) {
	relPath, relErr := filepath.Rel(modDir, pboPath)
	if relErr != nil {
		relPath = filepath.Base(pboPath)
	}

	res := PboVerificationResult{
		PboPath:     relPath,
		BisignFiles: findBisignsForPbo(pboPath),
	}

	if len(res.BisignFiles) == 0 {
		res.HasBisign = false
		res.Status = StatusMissingSignatures
		res.ErrorMessage = "No matching .bisign signature file found"
		return res, false
	}
	res.HasBisign = true

	pbo, err := OpenPBO(pboPath)
	if err != nil {
		res.Status = StatusError
		res.ErrorMessage = fmt.Sprintf("Failed to open/verify PBO archive: %v", err)
		return res, false
	}
	defer pbo.Close()

	var (
		pboVerified     bool
		lastErr         error
		verifiedKey     string
		isExtracted     bool
		candidateFailed bool
		failedKeyNames  []string
	)

	pboDir := filepath.Dir(pboPath)
	for _, bName := range res.BisignFiles {
		bPath := filepath.Join(pboDir, bName)
		sig, sErr := ParseBISignFile(bPath)
		if sErr != nil {
			lastErr = fmt.Errorf("parse bisign %s: %w", bName, sErr)
			continue
		}

		matchedKey, isCandidate, kErr := reg.matchOrPrepareCandidateKey(sig, bPath)
		if kErr != nil {
			lastErr = fmt.Errorf("candidate key extraction from %s: %w", bName, kErr)
			continue
		}

		if matchedKey == nil {
			lastErr = fmt.Errorf("no matching .bikey for signature '%s' (authority: %s)", bName, sig.Name)
			continue
		}

		if verErr := VerifyPBO(pbo, sig, matchedKey); verErr != nil {
			lastErr = verErr
			if isCandidate {
				candidateFailed = true
				failedKeyNames = append(failedKeyNames, matchedKey.Name+bikeyExt)
			}
			continue
		}

		pboVerified = true
		verifiedKey = matchedKey.Name + bikeyExt
		if isCandidate {
			reg.saveConfirmedKey(matchedKey, bPath, report)
			isExtracted = true
		}
		break
	}

	if pboVerified {
		res.Status = StatusValid
		res.MatchingBikey = verifiedKey
		res.KeyExtracted = isExtracted
	} else {
		res.Status = StatusError
		if candidateFailed {
			res.KeyExtractionFailed = true
			keyNamesStr := strings.Join(failedKeyNames, ", ")
			res.ErrorMessage = fmt.Sprintf("Missing .bikey in mod: key was extracted from .bisign (%s), but signature does not match PBO (author published mismatched files: %v)",
				keyNamesStr, lastErr)
			for _, fk := range failedKeyNames {
				addUnique(&report.KeysExtractionFailed, fk)
			}
		} else if errors.Is(lastErr, ErrMissingBikey) || (lastErr != nil && strings.Contains(lastErr.Error(), "no matching .bikey")) {
			res.Status = StatusNoBikey
			if lastErr != nil {
				res.ErrorMessage = lastErr.Error()
			}
		} else if lastErr != nil {
			res.ErrorMessage = lastErr.Error()
		}
	}

	return res, isExtracted
}

func compileOverallStatus(report *ModSignatureReport, errorCount, warningCount int, hasExtracted bool) {
	if errorCount > 0 {
		report.OverallStatus = StatusError
		if len(report.KeysFound) == 0 && len(report.KeysExtractionFailed) > 0 {
			report.Summary = fmt.Sprintf("Missing .bikey: auto-recovery from .bisign failed because signature does not match PBO (%s; %d/%d PBOs failed - author published mismatched files)",
				strings.Join(report.KeysExtractionFailed, ", "), errorCount, report.TotalPBOs)
		} else {
			report.Summary = fmt.Sprintf("%d/%d PBOs verified; %d errors (signature mismatch or corrupted files)",
				report.VerifiedPBOs, report.TotalPBOs, errorCount)
		}
	} else if warningCount > 0 {
		report.OverallStatus = StatusWarning
		report.Summary = fmt.Sprintf("%d/%d PBOs verified; %d warnings (missing signatures or bikeys)",
			report.VerifiedPBOs, report.TotalPBOs, warningCount)
	} else {
		report.OverallStatus = StatusValid
		if hasExtracted {
			report.Summary = fmt.Sprintf("All %d PBOs verified (auto-extracted missing .bikey)", report.TotalPBOs)
		} else {
			report.Summary = fmt.Sprintf("All %d PBOs verified successfully", report.TotalPBOs)
		}
	}
}
