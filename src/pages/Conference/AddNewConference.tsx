import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CreateConfInput from "../../components/form/form-elements/CreateConfInput";

export default function AddConference() {
    return (
        <>
            <PageMeta
                title="Admin - Basic Tables"
                description="Dashboard page for TailAdmin"
            />
            <PageBreadcrumb pageTitle="New-Conference" />
            <div className="space-y-6">
                <ComponentCard title="Conference">
                    <CreateConfInput />
                </ComponentCard>
            </div>
        </>
    );
}
