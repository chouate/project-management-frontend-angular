// interface InventoryStatus {
//     label: string;
//     value: string;
// }
interface Technologie{
    name:string;
    ///description:string;
}
export interface User {
    id?: number;
    keycloakId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    image?: string;
    role?: string;
    //inventoryStatus?: InventoryStatus;
    technologies?: Technologie[];
}
