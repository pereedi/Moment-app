<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf'; // Import Notyf
import 'notyf/notyf.min.css'; // Import Notyf CSS

const email = ref('');
const password = ref('');
const emailerror = ref('');
const passworderror = ref('');

const router = useRouter();
const { $axios } = useNuxtApp();

let notyf;
if (typeof window !== 'undefined') {
  notyf = new Notyf(); // Initialize Notyf only on the client side
}

// Auto-fill user data when component loads
onMounted(() => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && isAuthenticated) {
    email.value = storedUser.email || "";
  } else {
    email.value = "";
    password.value = "";
  }
});

// Validate Form
const validateForm = () => {
  emailerror.value = "";
  passworderror.value = "";

  if (!email.value) {
    emailerror.value = "Please enter your email address.";
    return false;
  } else if (!email.value.includes("@")) {
    emailerror.value = "Please enter a valid email address.";
    return false;
  }

  if (!password.value) {
    passworderror.value = "Please enter your password";
    return false;
  } else if (password.value.length < 8) {
    passworderror.value = "Password must be at least 8 characters long.";
    return false;
  }

  return true;
};

// Submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const response = await $axios.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    const {token, user} = response.data;

    // store the authentication token in localstorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('isAuthenticated', 'true');

    notyf.success("Login successful!", { position: "top-right" });

    // redirect to mybucket after success
    setTimeout(() => {
      router.push("/MyBucket");
    }, 2000);
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    notyf.error("Invalid email or password!", { position: "top-right" });
  }
};
</script>




<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="md:w-[30%] w-[85%]">
        <!-- main -->
        <div class="mt-15 w-100 md:w-110 leading-6 mx-5">
          <h1 class="text-(length:--heading1) font-(--fontbold)">Welcome back,</h1>
          <p class="py-[5%]">
            Hi, my name is Eventful Moments, I am a bucket… no, not the bucket
            of water but I store awesome moments you will like to have in coming
            years.
          </p>
        </div>
        <div>
          <!-- form -->
          <form @submit="handleSubmit" class="mt-5 mx-5">
            <div class="">
              <div class="">
                <label for="Email" class="font-display">Email</label>
                <input
                  type="email"
                  name="Email"
                  id="Email"
                  v-model="email"
                  class="w-full p-[10px] border-solid border-[1px] rounded-[7px] mb-[15px]"
                />
                <p v-if="emailerror" class="text-red-500 text-xs">
                  {{ emailerror }}
                </p>
              </div>
              <div class="">
                <label for="Password">Password</label>
                <input
                  type="Password"
                  name="Password"
                  id="Password"
                  v-model="password"
                  class="w-full p-[10px] border-solid border-[1px] rounded-[7px] focus:outline-none"
                />
                <p v-if="passworderror" class="text-red-500 text-xs">
                  {{ passworderror }}
                </p>
              </div>
              <div class="flex items-center justify-center">
                <button
                  type="submit"
                  class="bg-[#5271FF] p-3 rounded-sm w-30 mt-5 text-white font-display text-sm font-bold align-center text-center  hover:bg-black"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>