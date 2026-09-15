export interface FileItemDto {
  name: string
  path: string
  isDir: boolean
  size: number
  modTime: string
  isReadOnly: boolean
  extension: string
}

export interface FileListResponseDto {
  path: string
  items: FileItemDto[]
}

export interface FileContentResponseDto {
  path: string
  content: string
}

export interface CreateItemDto {
  path: string
  isDir: boolean
}

export interface RenameItemDto {
  oldPath: string
  newPath: string
}

export interface ExtractZipDto {
  zipPath: string
  destination?: string
}

export interface CompressZipDto {
  paths: string[]
  destinationZip: string
}

export interface DownloadSelectedZipDto {
  paths: string[]
  filename?: string
}
