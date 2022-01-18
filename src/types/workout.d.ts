import {Chart, TMeasureBy} from './';
import {TemplateReference} from './template';
import {ExerciseReference} from './exercise';

// Workout
export type Workout = {
    _id: string;
    duration: number;
    name: string;
    notes: string;
    recordedExercises: RecordedExercise[];
    uniqueExercises: string[];
    options?: {
        charts?: Chart[];
    };
    templateReference: TemplateReference | null;
    public: boolean;
    createdAt: Date;
    createdAtText?: string;
};

export type RecordedExercise = {
    exerciseReference: ExerciseReference;
    notes: string;
    options: {
        measureBy: TMeasureBy;
        weightUnit: 'kg' | 'lb';
    };
    sets: RecordedSet[];
    uid?: string;
};

export type RecordedSet = {
    weightAmount: number;
    measureAmount: number;
    measureBy: TMeasureBy;
};

// API
export type QueryWorkoutParams = {
    init: QueryWorkoutInit;
};

export type QueryWorkoutInit = {
    headers?: {
        Authorization?: string;
    };
    queryStringParameters?: {
        templateId?: string;
        loadAmount?: number;
    };
};

export type GetWorkoutParams = {
    workoutId: string;
    init: GetWorkoutInit;
};

export type GetWorkoutInit = {
    headers?: {
        Authorization?: string;
    };
    queryStringParameters?: {
        username?: string;
    };
};
