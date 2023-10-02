<template>
  <div v-if="item" class="main-container margin-bottom" :style="cssProps">
    <div class="container-header">
      <div class="avatar">
        <img :src="item.url_profile" alt="" />
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <h2>{{ item.title }}</h2>
      </div>
      <div class="section-body socialpost-body">
        <div class="ql-editor">
          <div v-html="item.body"></div>
        </div>
      </div>
    </div>

    <div v-if="item.fileAllegato" class="section">
      <div>
        <embed :src="item.fileAllegato" width="900px" height="900px" />
      </div>
    </div>

    <div v-if="socialsArray.length > 0" class="section">
      <SocialButton
        v-for="social in socialsArray"
        :key="social"
        :nameSocial="social"
      ></SocialButton>
    </div>

    <!-- <div v-if="formContatto.length" class="section">
      <div class="section-form">
        <h3>Form di Contatto</h3>
        <span class="section-didascalia"> * campi obbligatori </span>
        <form>
          <div v-for="item in formContatto" :key="item.label" class="form-item">
            <div>
              <label :for="item.label">{{ item.label }}</label>
              <span v-if="item.required"> *</span>
            </div>
            <div>
              <input
                @keyup="formStarted"
                type="text"
                :id="item.label"
                :placeholder="item.label"
                v-model="item.value"
                :class="{ required: item.error }"
              />
            </div>
          </div>
          <button @click="sendForm">{{ testoBottone }}</button>
        </form>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import axios from "axios"
import { useRoute } from "vue-router"
import SocialButton from "@/components/SocialButton.vue"

const route = useRoute()

const item = ref(null)
const formContatto = ref([])

const ipAddress = ref("")
const startingTime = ref(null)
const elapsedTime = ref(0)
const timer = ref(null)

const docHeight = ref(0)

const listenformStarted = ref(true)

const testoBottone = ref("Invia")

async function getIpAddress() {
  try {
    const response = await axios.get(
      "https://ipinfo.io/json/?token=a91b9e60107288"
    )
    const { data } = response
    ipAddress.value = data.ip
    console.log(
      "🚀 ~ file: HomeView.vue:96 ~ getIpAddress ~ ipAddress.value:",
      ipAddress.value
    )
  } catch (error) {
    console.log("Error retrieving IP address:", error)
  }
}

function sendForm(e) {
  e.preventDefault()
  let error = null
  formContatto.value.forEach((element) => {
    if (element.required && !element.value) {
      error = true
      element.error = true
    } else {
      element.error = false
    }
  })

  if (error) {
    console.log("ERRORE: CAMPO OBBLIGATORIO VUOTO ")
    return
  } else {
    if (ipAddress.value) {
      axios
        .post(
          `https://api-yoube.whappy.it/api/SocialShare/SendForm/${route.params.id}/${route.params.code}/${ipAddress.value}`,
          formContatto.value
        )
        .then((res) => {
          console.log("🚀 ~ file: index.vue ~ line 162 ~ sendForm ~ res", res)
          testoBottone.value = "Form inviato correttamente, grazie!"
          setTimeout(() => {
            formContatto.value.forEach((element) => {
              element.value = ""
            })
            testoBottone.value = "Invia"
          }, 3000)
        })
    }
  }
}

function getLandingData() {
  axios
    .get(
      //     "https://api-trivellato.whappy.it/api/Landing/" +
      "https://api-yoube.whappy.it/api/Landing/" + route.params.id
    )
    .then((res) => {
      item.value = res.data

      item.value.title = item.value.title["it-IT"]
      item.value.body = item.value.body["it-IT"]
    })

  if (ipAddress.value) {
    axios
      .post(
        `SocialShare/SetLandingOpen/${route.params.id}/${route.params.code}/${ipAddress.value}`
      )
      .then((res) => {
        console.log(
          "🚀 ~ file: index.vue ~ line 193 ~ getLandingData ~ res",
          res
        )
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: index.vue ~ line 196 ~ getLandingData ~ error",
          error
        )
      })
  }
}

function sendTimeSpentOnPage() {
  console.log(
    "sendTimeSpentOnPage -> -> -> ",
    elapsedTime.value.toFixed(0).toString()
  )
  if (ipAddress.value) {
    axios
      .post(
        `https://api-yoube.whappy.it/api/SocialShare/SetLandingTimeOfStay/${
          route.params.id
        }/${route.params.code}/${elapsedTime.value.toFixed(0).toString()}/${
          ipAddress.value
        }`
      )
      .then((res) => {
        console.log(
          "🚀 ~ file: index.vue:125 ~ SetLandingTimeOfStay.then ~ res:",
          res
        )
      })
      .catch((error) => {
        console.log("Error in POST request:", error)
      })
  }
}

const cssProps = computed(() => {
  return {
    "--url-bg": "url(" + item.value.url_cover + ")",
  }
})

const socialsArray = computed(() => {
  let array = []
  if (item.value.social) {
    item.value.social.forEach((element) => {
      element.nome ? array.push(element) : null
    })
  }
  return array
})

watch(
  item,
  (val) => {
    formContatto.value = []
    val.form.fields.forEach((element) => {
      formContatto.value.push({
        label: element.name["it-IT"],
        value: "",
        required: element.required,
        error: false,
      })
    })
  },
  { deep: true }
)

onMounted(() => {
  startingTime.value = Date.now()
  timer.value = setInterval(() => {
    elapsedTime.value = Date.now() - startingTime.value
  }, 1000)

  getIpAddress()
  getLandingData()
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  sendTimeSpentOnPage()
})

function formStarted() {
  console.log("trig form clicked ")
  if (listenformStarted.value) {
    console.log("listen form clicked TRUE ")
    if (ipAddress.value) {
      axios
        .post(
          `https://api-yoube.whappy.it/api/SocialShare/SetLandingStartForm/${route.params.id}/${route.params.code}/${ipAddress.value}`
        )
        .then((res) => {
          console.log(
            "🚀 ~ file: index.vue:125 ~ SetLandingStartForm.then ~ res:",
            res
          )
          listenformStarted.value = false
        })
        .catch((error) => {
          console.log("Error in POST request:", error)
        })
      return
    }
    return
  }
}

const visibilityChangeMap = {
  hidden: "visibilitychange",
  mozHidden: "mozvisibilitychange",
  msHidden: "msvisibilitychange",
  webkitHidden: "webkitvisibilitychange",
}

const visibilityChange = ref(null)

for (const property in visibilityChangeMap) {
  if (typeof document[property] !== "undefined") {
    visibilityChange.value = visibilityChangeMap[property]
    break
  }
}

window.addEventListener("scroll", handleScroll)

function getDocHeight() {
  var D = document
  return Math.max(
    D.body.scrollHeight,
    D.documentElement.scrollHeight,
    D.body.offsetHeight,
    D.documentElement.offsetHeight,
    D.body.clientHeight,
    D.documentElement.clientHeight
  )
}

function handleScroll() {
  const winHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  const docHeight = getDocHeight()
  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
  const trackLength = docHeight - winHeight

  const pctScrolled =
    trackLength > 0 ? Math.floor((scrollTop / trackLength) * 100) : 0
  console.log(pctScrolled + "% scrolled")

  if (pctScrolled >= item.value.scrollMin) {
    if (ipAddress.value) {
      axios
        .post(
          `https://api-yoube.whappy.it/api/SocialShare/SetLandingScroll/${route.params.id}/${route.params.code}/${ipAddress.value}`
        )
        .then((res) => {
          console.log(
            "🚀 ~ file: index.vue:125 ~ SetLandingScroll.then ~ res:",
            res
          )
        })
        .catch((error) => {
          console.log("Error in POST request:", error)
        })
    }
    window.removeEventListener("scroll", handleScroll)
  }
}
</script>
