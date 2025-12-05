import React from "react";

export default function AdminMetrics({ stats }) {
    const metrics = [
        {
            icon: "📦",
            label: "Total Products",
            value: stats.totalProducts,
            color: "from-blue-500 to-cyan-500",
            subtext: stats.lowStock > 0 ? `⚠️ ${stats.lowStock} low stock` : null,
            subtextColor: "text-orange-600"
        },
        {
            icon: "🛒",
            label: "Total Orders",
            value: stats.totalOrders,
            color: "from-purple-500 to-pink-500",
            subtext: stats.pendingOrders > 0 ? `⏳ ${stats.pendingOrders} pending` : null,
            subtextColor: "text-yellow-600"
        },
        {
            icon: "👥",
            label: "Total Users",
            value: stats.totalUsers,
            color: "from-green-500 to-teal-500",
            subtext: null
        },
        {
            icon: "💰",
            label: "Total Revenue",
            value: `₹${stats.totalRevenue.toFixed(2)}`,
            color: "from-orange-500 to-red-500",
            subtext: `Avg: ₹${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0}`,
            subtextColor: "text-neutral-600"
        },
        {
            icon: "✅",
            label: "Completed Orders",
            value: stats.completedOrders || 0,
            color: "from-emerald-500 to-green-500",
            subtext: stats.totalOrders > 0 ? `${((stats.completedOrders || 0) / stats.totalOrders * 100).toFixed(1)}%` : '0%',
            subtextColor: "text-green-600"
        },
        {
            icon: "📈",
            label: "Conversion Rate",
            value: `${stats.conversionRate || 0}%`,
            color: "from-indigo-500 to-purple-500",
            subtext: "Last 30 days",
            subtextColor: "text-neutral-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
                <div
                    key={index}
                    className="card hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`text-5xl p-3 rounded-2xl bg-gradient-to-br ${metric.color} bg-opacity-10`}>
                            {metric.icon}
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold gradient-text">{metric.value}</div>
                            <div className="text-neutral-600 text-sm font-semibold">{metric.label}</div>
                        </div>
                    </div>
                    {metric.subtext && (
                        <div className={`text-xs font-semibold ${metric.subtextColor}`}>
                            {metric.subtext}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
