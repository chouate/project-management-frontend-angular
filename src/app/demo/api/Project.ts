import {Technology} from "./technology";

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
    duration?: number;
    actualWorkDays?: number;

    clientId?: number;
    projectManagerId?: number;
    phaseId?: number;
    statusPhaseId?: number;

    client?: Client;
    phase?: Phase;
    statusPhase?: PhaseStatus;
    tasks?: Task[];
    projectManager?: ProjectManager;

    documents?: Document[];

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
    description?: string;
    //status?: PhaseStatus;
}

interface PhaseStatus{
    id?: number;
    name?: string;
    description?: string;
}


 interface Task{
    id?: number;
    name?: string;
    description?: string;
    status?: TaskStatus;
    actualWorkDays?: number;
    progress?: number;
    owner?: Owner;
    ownerId?: number;
    completionPercentage?: number;
    startDate?: Date;
    endDate?: Date;
    estimatedWorkDays?: number;
    duration?: number;
    technology?: Technology;

}

interface Owner{
    id?: number;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
}

interface TaskStatus{
    id?: number;
    name?: string;
    description?: string;
}

interface Document{
    id?: number;
    name?: string;
    type?: string;
    path?: string;
    dateAdded?: Date;
}
