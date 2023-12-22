import { AssignmentStatus } from "../enums/AssignmentStatus";

export const getAssignmentStatus = async (publishedAt: Date): Promise<AssignmentStatus> => {
    const today = new Date();
    if (publishedAt < today || publishedAt == today) {
        return AssignmentStatus.Ongoing;
    } else {
        return AssignmentStatus.Scheduled;
    }
}