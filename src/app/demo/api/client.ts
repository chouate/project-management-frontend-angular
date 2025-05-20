interface ProjectManager {
    id?:number
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
}
export interface Client {
    id?: number;
    code?: string;
    name?: string;
    activityDomain?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    startDate?: Date;
    endDateEstimate?: Date ;
    directorId?: number;
    projectManagerId?: number;
    projectManager?: ProjectManager;
}
