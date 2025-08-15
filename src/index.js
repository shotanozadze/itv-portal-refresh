import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
const resolver = new Resolver();

resolver.define("getIssueUpdated", async (req) => {
    const { issueKey } = req.payload;
    const res = await api
        .asApp()
        .requestJira(
            route`/rest/api/2/issue/${issueKey}`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
    if (!res.ok) {
        console.error("Fetch Error");
        return null;
    }
    const data = await res.json();
    return data.fields.updated;
});
export const handler = resolver.getDefinitions();

export async function run(event, context) {
    // For testing
}
