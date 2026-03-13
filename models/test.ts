export interface TrafficHazardAll {
    id:          string;
    hazard_type: string;
    latitude:    number;
    longitude:   number;
    description: string;
    reported_at: Date;
}
