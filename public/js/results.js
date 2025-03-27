document.addEventListener('DOMContentLoaded', async () => {
    const calendarContainer = document.getElementById('calendar');
    const slotInfo = document.getElementById('slot-info');

    // Fetch the best N-day slot
    const slotResponse = await fetch('/api/availability/best-slot');
    const { bestSlot, maxMean } = await slotResponse.json();

    // Display the best N-day slot
    if (bestSlot.length > 0) {
        const firstDay = bestSlot[0].split('-').slice(1).join('/');
        const lastDay = bestSlot[bestSlot.length - 1].split('-').slice(1).join('/');
        slotInfo.textContent = `Dal ${firstDay} al ${lastDay}   media: ${maxMean.toFixed(2)} persone/giorno`;
    } else {
        slotInfo.textContent = 'Nessun dato disponibile';
    }

    // Fetch availability data
    const response = await fetch('/api/availability');
    const availabilities = await response.json();

    // Calculate the number of people who selected each day
    const daysCount = {};
    availabilities.forEach(({ days }) => {
        days.forEach(day => {
            daysCount[day] = (daysCount[day] || 0) + 1;
        });
    });

    // Determine the maximum number of people who selected a single day
    const maxCount = Math.max(...Object.values(daysCount), 0);

    // Generate the calendar
    const startDate = new Date('2025-07-01');
    const endDate = new Date('2025-08-31');

    // Add offset for the first day of the month
    const firstDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    for (let i = 0; i < firstDayOfWeek - 1; i++) {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'calendar-day placeholder'; // Add a class for styling
        calendarContainer.appendChild(placeholderDiv);
    }

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = date.getDate(); // Display only the day number

        const dateString = date.toISOString().split('T')[0];
        const count = daysCount[dateString] || 0;

        // Set the background color based on the count
        if (maxCount > 0) {
            const opacity = count / maxCount; // Calculate opacity proportional to the count
            dayDiv.style.backgroundColor = `rgba(0, 128, 0, ${opacity})`; // Green with varying opacity
        } else {
            dayDiv.style.backgroundColor = 'white'; // Default color if no data
        }

        calendarContainer.appendChild(dayDiv);
    }
});
