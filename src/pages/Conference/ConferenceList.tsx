import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ConferenceList, { Conference } from "../../components/conference/ConferenceList";
import { getAllConferences } from "../../service/ConferenceService";

export default function ConferenceTables() {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getAllConferences()
            .then((data) => {
                setConferences(data);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <PageMeta
                title="Admin - Basic Tables"
                description="Dashboard page for TailAdmin"
            />
            <PageBreadcrumb pageTitle="conference" />
            <div className="space-y-6">
                <ComponentCard title="Conference List">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ConferenceList conferences={conferences} />
                    )}
                </ComponentCard>
            </div>
        </>
    );
}
