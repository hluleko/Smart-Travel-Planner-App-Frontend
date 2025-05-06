<template>
    <section class="search-tool">
      <div class="hero">
        <div class="search-bar">
          <!-- Location input -->
          <div class="search-input-container">
            <label for="location">Destination</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="location"
                placeholder="Where are you going?"
                class="search-input"
                ref="locationInput"
                v-model="destination"
              />
              <svg class="input-icon" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
            </div>
          </div>
  
          <!-- Check-in -->
          <div class="search-input-container">
            <label>Start date</label>
            <VueDatePicker
              v-model="checkIn"
              placeholder="Add dates"
              :enable-time-picker="false"
              auto-apply
              :min-date="new Date()"
              :format="formatDate"
              :day-names="['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            >
              <template #input-icon>
                <svg class="calendar-icon" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
                </svg>
              </template>
            </VueDatePicker>
          </div>
  
          <!-- Check-out -->
          <div class="search-input-container">
            <label>Start end</label>
            <VueDatePicker
              v-model="checkOut"
              placeholder="Add dates"
              :enable-time-picker="false"
              auto-apply
              :min-date="checkIn || new Date()"
              :format="formatDate"
              :day-names="['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            />
          </div>
  
          <!-- Guests/Rooms -->
          <div class="search-input-container">
            <label>Guests</label>
            <div class="guest-room-trigger" @click.stop="toggleDropdown">
              <div>{{ totalGuests }} guests · {{ rooms }} room{{ rooms > 1 ? 's' : '' }}</div>
              <svg class="chevron-icon" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            
            <div v-if="showDropdown" class="guest-room-dropdown">
              <div class="dropdown-section">
                <div class="counter-label">
                  <div>
                    <h4>Adults</h4>
                    <p>Age 18+</p>
                  </div>
                  <div class="counter-controls">
                    <button @click="adults > 1 ? adults-- : null">−</button>
                    <span>{{ adults }}</span>
                    <button @click="adults++">+</button>
                  </div>
                </div>
              </div>
              
              <div class="dropdown-section">
                <div class="counter-label">
                  <div>
                    <h4>Children</h4>
                    <p>Ages 0-17</p>
                  </div>
                  <div class="counter-controls">
                    <button @click="children > 0 ? children-- : null">−</button>
                    <span>{{ children }}</span>
                    <button @click="children++">+</button>
                  </div>
                </div>
              </div>
              
              <div class="dropdown-section">
                <div class="counter-label">
                  <div>
                    <h4>Rooms</h4>
                  </div>
                  <div class="counter-controls">
                    <button @click="rooms > 1 ? rooms-- : null">−</button>
                    <span>{{ rooms }}</span>
                    <button @click="rooms++">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <button class="search-button" @click="$router.push('/findlocations')">
            <span>Search</span>
            <svg class="search-icon" viewBox="0 0 24 24">
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import VueDatePicker from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  
  export default {
    components: { VueDatePicker },
    data() {
      return {
        destination: "",
        checkIn: null,
        checkOut: null,
        adults: 2,
        children: 0,
        rooms: 1,
        showDropdown: false,
        guests: 2,
        apiKey: "AIzaSyDxU7_6cH1hUL7Yv_IWXKJ4sVlIQAINp2E", 
      };
    },
    computed: {
      totalGuests() {
        return this.adults + this.children;
      }
    },
    methods: {
      formatDate(date) {
        return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      loadGoogleMaps() {
      if (window.google && window.google.maps) {
        this.initAutocomplete();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = this.initAutocomplete;
        document.head.appendChild(script);
      }
    },
    initAutocomplete() {
      const input = this.$refs.locationInput;
      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: "ZA" },
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        this.destination = place.formatted_address || place.name;
      });
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleClickOutside(e) {
      if (!e.target.closest(".guest-room")) {
        this.showDropdown = false;
      }
    },
    searchHotels() {
      console.log("Searching:", {
        destination: this.destination,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        guests: this.guests,
        rooms: this.rooms,
      });
    },

    }
  };
  </script>
  
  <style scoped>
  .search-tool {
    background: #fff;
    padding: 2rem 0;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    gap: 2px;
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 30px;
    padding: 5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  .search-input-container {
    position: relative;
    flex: 1;
    padding: 10px 20px;
    border-right: 1px solid #eee;
  }
  
  .search-input-container:last-child {
    border-right: none;
  }
  
  label {
    display: block;
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    fill: #666;
  }
  
  input.search-input {
    width: 100%;
    padding: 8px 8px 8px 30px;
    border: none;
    font-size: 0.9rem;
    background: transparent;
  }
  
  input.search-input:focus {
    outline: none;
  }
  
  .guest-room-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
  }
  
  .chevron-icon {
    width: 20px;
    height: 20px;
    fill: #666;
  }
  
  .guest-room-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-top: 10px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 1000;
  }
  
  .dropdown-section {
    margin-bottom: 20px;
  }
  
  .counter-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .counter-label h4 {
    margin: 0;
    font-size: 0.9rem;
  }
  
  .counter-label p {
    margin: 2px 0 0;
    font-size: 0.75rem;
    color: #666;
  }
  
  .counter-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .counter-controls button {
    width: 28px;
    height: 28px;
    border: 1px solid #006ce4;
    border-radius: 50%;
    background: none;
    color: #006ce4;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .counter-controls button:disabled {
    border-color: #ccc;
    color: #ccc;
    cursor: not-allowed;
  }
  
  .search-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #006ce4;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .search-button:hover {
    background: #0056b3;
  }
  
  .search-icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
  
  /* Date picker customizations */
  .dp__input {
    border: none !important;
    padding-left: 24px !important;
    background: transparent !important;
  }
  
  .calendar-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    fill: #666;
  }
  
  @media (max-width: 768px) {
    .search-bar {
      flex-direction: column;
      border-radius: 12px;
      padding: 15px;
      gap: 10px;
    }
    
    .search-input-container {
      width: 100%;
      border-right: none;
      padding: 0;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    .search-input-container:last-child {
      border-bottom: none;
    }
  }
  </style>