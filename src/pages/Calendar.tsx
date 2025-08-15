import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { getAllConferences } from "../service/ConferenceService"; // Thêm dòng này

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    description?: string;
    location?: string;
    bannerUrl?: string;
    status?: boolean;
    topics?: any[];
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const colorList = ["Primary", "Success", "Danger", "Warning", "Info", "Secondary"];
  function getColorByIndex(index: number) {
    return colorList[index % colorList.length];
  }

  useEffect(() => {
  }, []);

  useEffect(() => {
    // Lấy danh sách conference từ API và chuyển thành event cho calendar
    const fetchConferences = async () => {
      try {
        const conferences = await getAllConferences();
        const conferenceEvents: CalendarEvent[] = conferences.map((conf: any, idx: number) => ({
          id: conf.conferenceId?.toString(),
          title: conf.title,
          start: conf.startDate?.split("T")[0],
          end: conf.endDate?.split("T")[0],
          extendedProps: {
            calendar: getColorByIndex(idx),
            description: conf.description,
            location: conf.location,
            bannerUrl: conf.bannerUrl,
            status: conf.status,
            topics: conf.topics,
          },
        }));
        setEvents(conferenceEvents);
      } catch (error) {
        setEvents([]);
      }
    };
    fetchConferences();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setSelectedEvent({
      id: undefined,
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      extendedProps: {
        calendar: "",
        description: "",
        location: "",
        bannerUrl: "",
        status: false,
        topics: [],
      },
    });
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const resetModalFields = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next", // Bỏ addEventButton
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[500px] max-h-[80vh] p-6 lg:p-8 overflow-y-auto"
        >
          <div className="flex flex-col px-2 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Conference Information
              </h5>
            </div>
            {selectedEvent && (
              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Title
                  </label>
                  <div className="text-base text-gray-800 dark:text-white/90">{selectedEvent.title}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Description
                  </label>
                  <div className="text-base text-gray-800 dark:text-white/90">{selectedEvent.extendedProps?.description}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Location
                  </label>
                  <div className="text-base text-gray-800 dark:text-white/90">{selectedEvent.extendedProps?.location}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Time
                  </label>
                  <div className="text-base text-gray-800 dark:text-white/90">
                    {selectedEvent.start ? formatDate(selectedEvent.start) : ""} - {selectedEvent.end ? formatDate(selectedEvent.end) : ""}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Topics
                  </label>
                  <div className="text-base text-gray-800 dark:text-white/90">
                    {(selectedEvent.extendedProps?.topics || []).map((topic: any) => topic.topicName).join(", ")}
                  </div>
                </div>
                {selectedEvent.extendedProps?.bannerUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Banner
                    </label>
                    <img src={selectedEvent.extendedProps.bannerUrl} alt="Banner" className="max-w-full h-auto rounded" />
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      {/* <div className="fc-event-time">{eventInfo.timeText}</div> */}
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

function formatDate(date: any) {
  let d: Date;
  if (typeof date === "string" || typeof date === "number" || date instanceof Date) {
    d = new Date(date);
  } else if (date && typeof date.toDate === "function") {
    d = date.toDate();
  } else {
    return "";
  }
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: undefined,
  });
}

export default Calendar;
