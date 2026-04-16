


export const userKeys = {
    all: ["users"],
    list: (params: any) => ["users", "list", params],
    details: (id: string) => ["users", "details", id],
}