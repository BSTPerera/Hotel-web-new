
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables
  let currentBooking = "";
  let currentBookingCost = 0;
  let overallBooking = "";
  let overallBookingCost = 0;
  let loyaltyPoints = 0;

  // Update booking details on the page
  function updateBookingDetails() {
    document.getElementById("currentBooking").innerText = currentBooking;
    document.getElementById("currentBookingCost").innerText = currentBookingCost.toLocaleString("en-US", { style: "currency", currency: "LKR" });
    document.getElementById("overallBooking").innerText = overallBooking;
    document.getElementById("overallBookingCost").innerText = overallBookingCost.toLocaleString("en-US", { style: "currency", currency: "LKR" });
  }

  // Calculate the cost of the booking
  function calculateBookingCost(roomType, numRooms, numAdults, numChildren, duration, wifi, poolView, gardenView) {
    let roomCost = 0;

    if (roomType === "single") {
      roomCost = 25000;
    } else if (roomType === "double") {
      roomCost = 35000;
    } else if (roomType === "triple") {
      roomCost = 40000;
    } else {
      console.error("Invalid room type");
      return 0;
    }

    let mealCost = 5000 * numChildren;
    let totalRoomCost = roomCost * numRooms + mealCost;

    if (document.getElementById("promoCode").value === "Promo123") {
      totalRoomCost *= 0.95; // Apply promo code discount (5%)
    }

    if (wifi) totalRoomCost += 1000;
    if (poolView) totalRoomCost += 2000;
    if (gardenView) totalRoomCost += 1500;

    return totalRoomCost * duration;
  }

  // Event listeners
  document.getElementById("bookButton").addEventListener("click", function () {
    let roomType = document.getElementById("roomType").value;
    let numRooms = parseInt(document.getElementById("numRooms").value);
    let numAdults = parseInt(document.getElementById("numAdults").value);
    let numChildren = parseInt(document.getElementById("numChildren").value);
    let duration = parseInt(document.getElementById("duration").value);
    let wifi = document.getElementById("wifi").checked;
    let poolView = document.getElementById("poolView").checked;
    let gardenView = document.getElementById("gardenView").checked;
    let extraBed = document.getElementById("extraBed").checked;

    currentBookingCost = calculateBookingCost(roomType, numRooms, numAdults, numChildren, duration, wifi, poolView, gardenView);
    currentBooking = `${numRooms} ${roomType} room(s) for ${numAdults} adults and ${numChildren} children for ${duration} night(s)`;
    overallBooking += `${currentBooking} with ${extraBed ? 'extra bed, ' : ''}`;
    overallBookingCost += currentBookingCost;

    
    updateBookingDetails();
  });

  document.getElementById("advButton").addEventListener("click", function () {
    let adventureDetails = "";
    let adventureCost = 0;

    document.querySelectorAll('input[name="adventure"]:checked').forEach(function (adventure) {
      switch (adventure.id) {
        case "localadults":
          adventureDetails += "Diving for local Adults (1 hr), ";
          adventureCost += 5000;
          break;
        case "localkids":
          adventureDetails += "Diving for local kids (above 5 years), ";
          adventureCost += 2000;
          break;
        case "foreignadults":
          adventureDetails += "Diving for foreign adults, ";
          adventureCost += 10000;
          break;
        case "foreignkids":
          adventureDetails += "Diving for foreign kids, ";
          adventureCost += 5000;
          break;
      }
    });

    document.querySelectorAll('input[name="divinguide"]:checked').forEach(function (guide) {
      switch (guide.id) {
        case "adultsguide":
          adventureDetails += "Adult guide, ";
          adventureCost += 1000;
          break;
        case "kidsguide":
          adventureDetails += "Kids guide, ";
          adventureCost += 500;
          break;
      }
    });

    alert(`Thank you for booking the following adventure:\n${adventureDetails.slice(0, -2)}`);

    currentBooking = "";
    currentBookingCost = 0;
    overallBooking += `${adventureDetails.slice(0, -2)}, `;
    overallBookingCost += adventureCost;

    updateBookingDetails();
  });

  document.getElementById("favButton").addEventListener("click", function () {
    localStorage.setItem("favoriteBooking", JSON.stringify({ booking: overallBooking, cost: overallBookingCost }));
    alert("Booking added to favourites!");
  });

  document.getElementById("checkLoy").addEventListener("click", function () {
    loyaltyPoints = parseInt(localStorage.getItem("loyaltyPoints")) || 0;
    let numRooms = parseInt(document.getElementById("numRooms").value);
    if (numRooms > 3) {
      loyaltyPoints += 20 * numRooms;
      localStorage.setItem("loyaltyPoints", loyaltyPoints);
      alert(`You have earned ${20 * numRooms} loyalty points!`);
    } else {
      alert("You have no additional loyalty points at this time.");
    }
  });

  document.getElementById("checkFav").addEventListener("click", function () {
    let favoriteBooking = JSON.parse(localStorage.getItem("favoriteBooking"));
    if (favoriteBooking) {
      alert(`Favourite Booking:\n${currentBooking}\n${overallBooking}\nCost: ${favoriteBooking.cost.toLocaleString("en-US", { style: "currency", currency: "LKR" })}`);
    } else {
      alert("No favourite booking found.");
    }
  });

  document.getElementById("resetForm").addEventListener("click", function () {
    document.getElementById("bookingForm").reset();
    currentBooking = "";
    currentBookingCost = 0;
    overallBookingCost = 0;
    overallBooking = "";
    updateBookingDetails();
  });

  // Initial setup or any other initialization logic goes here
  updateBookingDetails();
});

