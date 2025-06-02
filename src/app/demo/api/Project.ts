export interface Project{
    id?: number;
    name?: string;
    description?: string;
    status?: string;
    progress?: number;
    startDate?: Date;
    endDate?: Date ;
    deliveryDate?: Date;
    estimatedWorkDays?: number;
    actualWorkDays?: number;

    clientId?: number;
    projectManagerId?: number;
    phaseId?: number;

    client?: Client;
    phase?: Phase;
    tasks?: Task[];
    projectManager?: ProjectManager;

}

interface Client{
    id?: number;
    name?: string;
    code?: string;
}

interface ProjectManager{
    id?: number;
    name?: string;
    image?: string;
}

interface Phase{
    id?: number;
    name?: string;
    phaseStatus?: string;
}

interface Task{
    id?: number;
    description?: string;
    status?: string;
    progress?: number;
}
