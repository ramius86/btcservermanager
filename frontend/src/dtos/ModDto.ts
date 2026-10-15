import { CreatorDlcDto } from './ServerDto';

export interface ModDto {
    id: number;
    name: string;
    serverType: string;
    fileSize: number;
    lastUpdated: string | null;
    installationStatus: string;
    errorStatus: string | null;
    serverOnly: boolean;
    biKeys: string[];
    thumbnail?: string;
    needsUpdate?: boolean;
    signatureStatus?: string;
    signatureSummary?: string;
}

export interface PboVerificationResultDto {
    pboPath: string;
    hasBisign: boolean;
    bisignFiles: string[];
    matchingBikey: string;
    keyExtracted?: boolean;
    keyExtractionFailed?: boolean;
    status: 'VALID' | 'WARNING' | 'ERROR' | 'NO_BIKEY' | 'MISSING_SIGNATURES';
    errorMessage?: string;
}

export interface ModSignatureReportDto {
    modId: number;
    modName: string;
    overallStatus: 'VALID' | 'WARNING' | 'ERROR' | 'NO_BIKEY' | 'MISSING_SIGNATURES';
    totalPbos: number;
    verifiedPbos: number;
    keysFound: string[];
    keysExtracted: string[];
    keysExtractionFailed?: string[];
    pboResults: PboVerificationResultDto[];
    summary: string;
}

export const IN_PROGRESS_MOD_STATUSES = new Set([
    'INSTALLATION_IN_PROGRESS',
    'DOWNLOADING',
    'PREALLOCATING',
    'COMMITTING',
    'VERIFYING',
    'IN_QUEUE'
]);

export const isModInProgress = (status?: string | null): boolean => {
    return Boolean(status && IN_PROGRESS_MOD_STATUSES.has(status));
};

export interface SteamCmdItemInfoDto {
    itemId: number;
    status: string;
    progress: number;
    current: number;
    total: number;
}

export interface ModPresetDto {
    id?: number;
    name: string;
    serverType: string;
    mods?: ModDto[];
    reforgerMods?: { id: string; name?: string; thumbnail?: string }[];
}

export interface WorkshopResponseDto {
    workshopMods: ModDto[];
    creatorDlcs: CreatorDlcDto[];
}
