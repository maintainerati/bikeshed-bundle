export interface IFocusForm {
    properties: {
        eventId: IFieldEnum;
        sessionId: IFieldEnum;
        spaceId: IFieldEnum;
        join: unknown;
    };
    required: string[];
    title: string;
    type: string;
}

export interface IFieldEnum {
    enum: string[];
    enum_titles: string[];
    propertyOrder: number;
    title: string;
    type: string;
}
