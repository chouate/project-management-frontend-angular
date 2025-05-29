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

    client?: Client;
    phase?: Phase;
    tasks?: Task[];

}

interface Client{
    id?: number;
    name?: string;
    code?: string;
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
    progress?: string;
}
