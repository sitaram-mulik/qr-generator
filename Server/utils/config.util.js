export const getClientUrl = () => {
    const clientUrl = process.env.CLIENT_URL || process.env.REACT_APP_API_URL || "";
    return clientUrl;
}