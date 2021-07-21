/** A user represents an agent that sends a message */

export interface User {
    id: string;
    name: string;
    avatarSrc: string;
    isClient?: boolean;
}

/** isClient - the person using the app */