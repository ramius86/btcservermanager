/**
 * Statuses that mean "nothing more will happen for this item".
 *
 * ERROR belongs here: before it was excluded, a failed installation stayed in
 * the progress map forever and the UI kept reporting SteamCMD as active.
 */
const TERMINAL_INSTALL_STATUSES = ['FINISHED', 'SUCCESS', 'ERROR']

export function isTerminalInstallStatus(status: string | null | undefined): boolean {
  if (!status) return false
  return TERMINAL_INSTALL_STATUSES.includes(status)
}
