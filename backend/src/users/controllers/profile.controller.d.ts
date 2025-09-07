interface ProfileData {
    userId: string;
    email: string;
    name: string;
    team: {
        id: string;
        name: string;
    }[];
}
export declare function profile(userId: string): Promise<ProfileData | null>;
export {};
//# sourceMappingURL=profile.controller.d.ts.map