<script setup>
import { ref, onMounted, computed } from "vue";
import { useNuxtApp } from "#app";
import { Notyf } from 'notyf'; // Import Notyf
import 'notyf/notyf.min.css'; // Import Notyf CSS

const { $axios } = useNuxtApp();

let notyf;
if (typeof window !== 'undefined') {
  notyf = new Notyf(); // Initialize Notyf only on the client side
}

const userName = ref("");
const events = ref([]);
const displayedEventsCount = ref(4); // Define displayedEventsCount

// Fetch user data from localStorage
onMounted(() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.fullName) {
    userName.value = userData.fullName.toUpperCase();
  } else {
    userName.value = "User"; // Fallback name if no full name is found
  }

  fetchEvents();
});

// Fetch events from the API
const fetchEvents = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await $axios.get("/moment", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API response:", response.data); // Log the API response
    events.value = response.data.data[0].data || []; // Ensure events is an array
    console.log("Fetched events:", events.value); // Log the fetched events
  } catch (error) {
    console.error(
      "Fetch events error:",
      error.response ? error.response.data : error.message
    );
    if (typeof window !== 'undefined') {
      notyf.error("Failed to fetch events! Please try again", {
        position: "top-right",
      });
    }
  }
};

const displayedEvents = computed(() => {
  return events.value.slice(0, displayedEventsCount.value);
});

const loadMore = () => {
  displayedEventsCount.value += 4;
};

const showLess = () => {
  displayedEventsCount.value = 4;
};
</script>


<template>
  <div>
    <!-- Event Buckets -->
    <div
      class="flex flex-col md:flex-row items-center md:justify-between mx-5 md:mx-20 my-9"
    >
      <div>
        <h1 class="font-display text-xl font-bold text-black">
          Welcome {{ userName }},
        </h1>
        <p class="font-display text-sm text-black">
          Here are items in your eventful moment bucket.
        </p>
        <div v-if="events && events.length === 0" class="mt-5">
          <p class="font-display text-sm text-black">No events found.</p>
        </div>
      </div>

      <NuxtLink to="/AddItem">
        <button
          class="bg-[#5271FF] p-3 rounded-md w-30 mt-5 text-white font-display text-sm font-bold align-center text-center hover:border hover:border-gray-600"
        >
          Add Item
        </button>
      </NuxtLink>
    </div>

    <!-- Event Buckets -->
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mx-5 md:mx-20 my-9">
        <div
          v-for="event in displayedEvents"
          :key="event._id"
          class="bg-white shadow-lg hover:bg-[#FFF5A7] p-6 md:p-5"
        >
          <div>
            <h2 class="font-display font-bold text-sm text-black mb-5">
              {{ event.title }}
            </h2>
            <p class="font-display text-xs text-black mb-5 text-justify">
              {{ event.details }}
            </p>
          </div>
          <div class="flex items-center justify-between">
            <NuxtLink
            :to="`/single-moment/${event._id}`"
            class="text-[#5271FF]"
          >
            View Details
          </NuxtLink>
            <div class="flex items-center gap-5">
              <p class="text-gray-600 text-sm">
                {{ new Date().toLocaleDateString() }}
              </p>
              <p class="text-black text-sm">
                {{ new Date(event.futureDate).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-5">
      <button
        v-if="events.length > displayedEventsCount"
        @click="loadMore"
        class="bg-[#5271FF] p-3 rounded-md text-white font-display text-sm font-bold align-center text-center hover:bg-black"
      >
        Load More
      </button>
      <button
        v-if="displayedEventsCount > 4"
        @click="showLess"
        class="bg-[#5271FF] p-3 rounded-md text-white font-display text-sm font-bold align-center text-center hover:bg-black ml-2"
      >
        Show Less
      </button>
    </div>
  </div>
</template>