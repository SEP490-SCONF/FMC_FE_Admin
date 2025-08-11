import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserListing from "../../components/users/UserList";

export default function UserManagement() {
  return (
    <>
      <PageMeta
        title="Admin - Basic Tables"
        description="Dashboard page for TailAdmin"
      />
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
        <ComponentCard title="User">
          <UserListing />
        </ComponentCard>
      </div>
    </>
  );
}
