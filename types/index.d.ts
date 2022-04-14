import {ExerciseReference} from './exercise';

export type TMeasureBy = 'repsWeight' | 'reps' | 'timeWeight' | 'time';
export type TChartType = 'recentWorkouts' | 'exercise';

export type ResponsiveDate = {
    unit: '' | 'day' | 'week' | 'month';
    amount: number;
    date: Date | null;
};

// Chart
export type ChartData = {
    preferenceIndex?: number;
    exercise?: ExerciseReference;
    dataToPull?: string;
};

export type Chart = {
    chartType: TChartType;
    startDate: ResponsiveDate;
    endDate: ResponsiveDate;
    interval: 'day' | 'week' | 'month';
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
    data?: ChartData;
};

// Chart API
export type GetStatsParams = {
    init: GetStatsInit;
    chartType: string;
};

export type GetStatsInit = {
    headers?: {
        Authorization?: string;
    };
    queryStringParameters: {
        username: string;
        timeZone: string;
        startDate: string;
        endDate: string;
        exerciseId?: string;
        preferenceIndex?: number;
        dataToPull?: string;
    };
};

export type FilePath = {
    key: string;
    fileType: 'image' | 'video';
};

export type ImageToUpload = {
    url: string;
    editable: boolean;
    id: number;
    path: FilePath | null;
};

// Comment
export type Like = {
    createdBy: {
        username: string;
        userId: string;
        profilePhoto: string;
    };
};

export type Follow = {
    userId: string;
    username: string;
    profilePhoto: string;
    createdAt: Date;
};

// Like API
export type QueryLikeParams = {
    init: QueryLikeInit;
    docId: string;
};

export type QueryLikeInit = {
    headers?: {
        Authorization?: string;
    };
    queryStringParameters: {
        coll: string;
        commentId?: string;
        loadAmount: number;
    };
};

export type CreateLikeParams = {
    init: CreateLikeInit;
};

export type CreateLikeInit = {
    headers?: {
        Authorization?: string;
    };
    queryStringParameters: {
        docId: string;
        coll: string;
    };
};

export type DeleteLikeParams = {
    init: DeleteLikeInit;
};

export type DeleteLikeInit = {
    headers?: {
        Authorization?: string;
    };
    queryStringParameters: {
        docId: string;
        coll: string;
    };
};
