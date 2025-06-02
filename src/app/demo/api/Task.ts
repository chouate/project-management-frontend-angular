export interface Task{
    id?: number;
    name?: string;
    description?: string;
    status?: string;
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
    image?: string;
}

