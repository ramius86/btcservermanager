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
}

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
