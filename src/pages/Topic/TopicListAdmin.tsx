import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TopicList from "../../components/topic/TopicList";

export default function TopicAdmin() {
    return (
        <>
            <PageMeta
                title="Admin - Basic Tables"
                description="Dashboard page for TailAdmin"
            />
            <PageBreadcrumb pageTitle="" />
            <div className="space-y-6">
                <ComponentCard title="Topic List">
                    <TopicList />
                </ComponentCard>
            </div>
        </>
    );
}
