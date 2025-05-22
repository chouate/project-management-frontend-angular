interface Technologie{
    name:string;
    //description:string;
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
    technologies?: Technologie[];
    technologyList?:Technologie[];
}
