const admin = [
    {
        method: "GET",
        path: "/",
        handler: "controller.index",
        config: {
        policies: [],
        },
    },
    {
        method: "POST",
        path: "/midjourney",
        handler: "controller.midjourney",
        config: {
            policies: [],
        },
    },
];
export default admin;
