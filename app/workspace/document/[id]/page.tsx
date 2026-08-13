import { DocumentClient } from "../../../components/DocumentClient";

export default async function Document({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <DocumentClient id={id} />;
}
