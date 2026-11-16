export default function OwnerCalendarPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Room Occupancy Calendar</h1>
      <p className="text-xs text-stone-500 mb-6">Interactive timeline showing unit bookings and free inventory slots.</p>

      <div className="bg-white border border-stone-200 rounded-xl p-10 text-center text-xs text-stone-500 shadow-sm">
        Interactive Occupancy Gantt Grid (Deluxe AC Rooms 1-4, Family Suites 1-2, Standard Non-AC 1-3)
      </div>
    </div>
  );
}
