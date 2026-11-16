export default function OwnerBookingsPage() {
  const dummyBookings = [
    { code: "DS-9281", guest: "Aarav Sharma", phone: "+91 98765 43210", dates: "01 Dec - 03 Dec", amount: 4928, status: "CONFIRMED" },
    { code: "DS-8192", guest: "Pooja Mishra", phone: "+91 98111 22233", dates: "05 Dec - 08 Dec", amount: 7840, status: "CONFIRMED" },
    { code: "DS-7712", guest: "Rohan Patel", phone: "+91 97222 33445", dates: "12 Dec - 14 Dec", amount: 2688, status: "HOLD" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Bookings Manager</h1>
      <p className="text-xs text-stone-500 mb-6">Manage all reservations and check-in statuses.</p>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Guest Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Dates</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {dummyBookings.map((b) => (
              <tr key={b.code} className="hover:bg-stone-50">
                <td className="py-3 px-4 font-mono font-bold text-amber-900">{b.code}</td>
                <td className="py-3 px-4 font-medium">{b.guest}</td>
                <td className="py-3 px-4">{b.phone}</td>
                <td className="py-3 px-4">{b.dates}</td>
                <td className="py-3 px-4 font-bold">₹{b.amount}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                    b.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
