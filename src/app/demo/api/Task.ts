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
    duration?: number;
    technologyId?: number;
    technology?: Technology;

}
interface Technology{
    id: number;
    name: string;
    descriotion: string;
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

