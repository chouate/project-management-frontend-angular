export interface Task{
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

