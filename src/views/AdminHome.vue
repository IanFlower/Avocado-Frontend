<script setup>
</script>

<template>
    <v-container>
        <v-row class="pa-5">
            <v-col align="center" class="mr-4">
                <v-card class="secondary" link to="/manageUsers">
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-2" width="55px" height="55px" viewBox="0 0 512 512"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="309.912" cy="82.088" r="34.088" fill="var(--ci-primary-color, #000000)"
                                        class="ci-primary" />
                                    <path fill="var(--ci-primary-color, #000000)"
                                        d="M322,143.462l-60.585-20.64L183.8,151.048A24.073,24.073,0,0,0,168,173.6V232h32V179.207l48.811-17.749L158.622,440h33.613l50.082-155.811,7.871,2.568L288,356.079V440h32V354.04a24.068,24.068,0,0,0-2.931-11.493l-37.56-68.861,28.949-88.715,19.27,34.684A24.011,24.011,0,0,0,348.707,232H400V200H353.414Z"
                                        class="ci-primary" />
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Users</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    Manage User Permissions
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col align="center" class="ml-4">
                <v-card class="secondary" to="approval" link>
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-3" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="45px" height="45px"
                                    viewBox="0 0 24 24" version="1.1">
                                    <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                                    <title>ic_fluent_checkbox_checked_24_regular</title>
                                    <desc>Created with Sketch.</desc>
                                    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none"
                                        fill-rule="evenodd">
                                        <g id="ic_fluent_checkbox_checked_24_regular" fill="#212121"
                                            fill-rule="nonzero">
                                            <path
                                                d="M18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 L18.25,3 Z M18.25,4.5 L5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 Z M10,14.4393398 L16.4696699,7.96966991 C16.7625631,7.6767767 17.2374369,7.6767767 17.5303301,7.96966991 C17.7965966,8.23593648 17.8208027,8.65260016 17.6029482,8.94621165 L17.5303301,9.03033009 L10.5303301,16.0303301 C10.2640635,16.2965966 9.84739984,16.3208027 9.55378835,16.1029482 L9.46966991,16.0303301 L6.46966991,13.0303301 C6.1767767,12.7374369 6.1767767,12.2625631 6.46966991,11.9696699 C6.73593648,11.7034034 7.15260016,11.6791973 7.44621165,11.8970518 L7.53033009,11.9696699 L10,14.4393398 L16.4696699,7.96966991 L10,14.4393398 Z"
                                                id="🎨Color"></path>
                                        </g>
                                    </g>
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Student Approval</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    Approve Documents/Requested Experiences
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="pa-5">
            <v-col align="center" class="mr-4">
                <v-card class="secondary" link to="AdminShop">
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-1" width="55px" height="55px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M2.5 4.25C2.5 3.83579 2.83579 3.5 3.25 3.5H3.80826C4.75873 3.5 5.32782 4.13899 5.65325 4.73299C5.87016 5.12894 6.02708 5.58818 6.14982 6.00395C6.18306 6.00134 6.21674 6 6.2508 6H18.7481C19.5783 6 20.1778 6.79442 19.9502 7.5928L18.1224 14.0019C17.7856 15.1832 16.7062 15.9978 15.4779 15.9978H9.52977C8.29128 15.9978 7.2056 15.1699 6.87783 13.9756L6.11734 11.2045L4.85874 6.95578L4.8567 6.94834C4.701 6.38051 4.55487 5.85005 4.33773 5.4537C4.12686 5.0688 3.95877 5 3.80826 5H3.25C2.83579 5 2.5 4.66421 2.5 4.25ZM7.57283 10.8403L8.32434 13.5786C8.47333 14.1215 8.96682 14.4978 9.52977 14.4978H15.4779C16.0362 14.4978 16.5268 14.1275 16.68 13.5906L18.4168 7.5H6.58549L7.55906 10.7868C7.56434 10.8046 7.56892 10.8224 7.57283 10.8403Z"
                                            fill="#212121"></path>
                                        <path
                                            d="M11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17C10.1046 17 11 17.8954 11 19ZM9.5 19C9.5 18.7239 9.27614 18.5 9 18.5C8.72386 18.5 8.5 18.7239 8.5 19C8.5 19.2761 8.72386 19.5 9 19.5C9.27614 19.5 9.5 19.2761 9.5 19Z"
                                            fill="#212121"></path>
                                        <path
                                            d="M18 19C18 20.1046 17.1046 21 16 21C14.8954 21 14 20.1046 14 19C14 17.8954 14.8954 17 16 17C17.1046 17 18 17.8954 18 19ZM16.5 19C16.5 18.7239 16.2761 18.5 16 18.5C15.7239 18.5 15.5 18.7239 15.5 19C15.5 19.2761 15.7239 19.5 16 19.5C16.2761 19.5 16.5 19.2761 16.5 19Z"
                                            fill="#212121"></path>
                                    </g>
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Purchase Rewards</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    Redeem Student Points/Edit Shop Items
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>

            <v-col align="center" class="ml-4">
                <v-card class="secondary" link to="AdminBadge">
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-2" width="50px" height="50px" viewBox="0 0 64 64"
                                    xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M45.41,11.16l.86,2.61a3.75,3.75,0,0,0,1.5,2L50,17.21a3.85,3.85,0,0,1,1.43,4.62l-.84,2.09a3.83,3.83,0,0,0,0,2.88l.83,2a3.83,3.83,0,0,1-1.32,4.58L48.13,34.8a3.86,3.86,0,0,0-1.46,2.08L46,39.32a3.84,3.84,0,0,1-4,2.78l-2.1-.18a3.88,3.88,0,0,0-2.74.84l-2,1.63a3.83,3.83,0,0,1-4.85,0L28.54,43a3.85,3.85,0,0,0-2.45-.88H23a3.83,3.83,0,0,1-3.74-3l-.55-2.35a3.82,3.82,0,0,0-1.58-2.31L15.3,33.19a3.84,3.84,0,0,1-1.45-4.48l.86-2.36a3.86,3.86,0,0,0,0-2.66l-.77-2.06a3.86,3.86,0,0,1,1.51-4.58l2-1.31a3.87,3.87,0,0,0,1.61-2.19l.61-2.18a3.85,3.85,0,0,1,4-2.79l1.93.17a3.88,3.88,0,0,0,2.74-.84l1.83-1.48a3.84,3.84,0,0,1,4.87,0L36.7,7.81a3.82,3.82,0,0,0,2.75.88l2-.15A3.84,3.84,0,0,1,45.41,11.16Z">
                                        </path>
                                        <path
                                            d="M44.59,41.57l7,12.21c.18.31,0,.64-.23.55l-8.61-3.5a.24.24,0,0,0-.31.19l-1.06,9c-.06.29-.42.25-.6-.06L32.65,45.25"
                                            stroke-linecap="round"></path>
                                        <path
                                            d="M32.65,45.25,25.14,60c-.19.31-.53.35-.6.07l-1.27-9.2a.24.24,0,0,0-.31-.18L14.59,54.3c-.28.08-.43-.24-.24-.56l7-12.17"
                                            stroke-linecap="round"></path>
                                        <path
                                            d="M32.74,16.89l2.7,5.49a.1.1,0,0,0,.08.05l6,.88c.08,0,.12.12.06.17l-4.38,4.27a.09.09,0,0,0,0,.09l1,6a.1.1,0,0,1-.14.11l-5.42-2.85a.07.07,0,0,0-.09,0L27.19,34a.11.11,0,0,1-.15-.11l1-6a.1.1,0,0,0,0-.09l-4.39-4.27a.11.11,0,0,1,.06-.17l6.05-.88a.09.09,0,0,0,.08-.05l2.71-5.49A.1.1,0,0,1,32.74,16.89Z"
                                            stroke-linecap="round"></path>
                                    </g>
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Badge Management</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    View and Create New Badges for Students to Unlock
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="pa-5">
            <v-col align="center" class="mr-4">
                <v-card class="secondary" to="AdminManageEvents" link>
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-3" xmlns="http://www.w3.org/2000/svg" width="50px" height="50px"
                                    viewBox="0 0 24 24" fill="#000000">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                        <path
                                            d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z">
                                        </path>
                                    </g>
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Events</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    Manage Events
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col align="center" class="ml-4">
                <v-card class="secondary" link to="Logs">
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-2" width="50px" height="50px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M21 11V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H15M21 11L15 5M21 11H16.6C16.0399 11 15.7599 11 15.546 10.891C15.3578 10.7951 15.2049 10.6422 15.109 10.454C15 10.2401 15 9.96005 15 9.4V5"
                                            stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Logs</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    View Logs
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row><v-row class="pa-5">
            <v-col align="center" class="mr-4">
                <v-card class="secondary" to="ManageExperiencesTasks" link>
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg class="mt-2" width="50px" height="50px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M11 6L21 6.00072M11 12L21 12.0007M11 18L21 18.0007M3 11.9444L4.53846 13.5L8 10M3 5.94444L4.53846 7.5L8 4M4.5 18H4.51M5 18C5 18.2761 4.77614 18.5 4.5 18.5C4.22386 18.5 4 18.2761 4 18C4 17.7239 4.22386 17.5 4.5 17.5C4.77614 17.5 5 17.7239 5 18Z"
                                            stroke="#000000" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </v-col>
                            <v-col>
                                <v-card-title>Tasks/Experiences</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    Manage Tasks/Experiences
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col align="center" class="ml-4">
                <v-card class="secondary" to="AdminViewRewards" link>
                    <v-container align="left">
                        <v-row>
                            <v-col cols="1">
                                <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M11.7255 17.1019C11.6265 16.8844 11.4215 16.7257 11.1734 16.6975C10.9633 16.6735 10.7576 16.6285 10.562 16.5636C10.4743 16.5341 10.392 16.5019 10.3158 16.4674L10.4424 16.1223C10.5318 16.1622 10.6239 16.1987 10.7182 16.2317L10.7221 16.2331L10.7261 16.2344C11.0287 16.3344 11.3265 16.3851 11.611 16.3851C11.8967 16.3851 12.1038 16.3468 12.2629 16.2647L12.2724 16.2598L12.2817 16.2544C12.5227 16.1161 12.661 15.8784 12.661 15.6021C12.661 15.2955 12.4956 15.041 12.2071 14.9035C12.062 14.8329 11.8559 14.7655 11.559 14.6917C11.2545 14.6147 10.9987 14.533 10.8003 14.4493C10.6553 14.3837 10.5295 14.279 10.4161 14.1293C10.3185 13.9957 10.2691 13.7948 10.2691 13.5319C10.2691 13.2147 10.3584 12.9529 10.5422 12.7315C10.7058 12.5375 10.9381 12.4057 11.2499 12.3318C11.4812 12.277 11.6616 12.1119 11.7427 11.8987C11.8344 12.1148 12.0295 12.2755 12.2723 12.3142C12.4751 12.3465 12.6613 12.398 12.8287 12.4677L12.7122 12.8059C12.3961 12.679 12.085 12.6149 11.7841 12.6149C10.7848 12.6149 10.7342 13.3043 10.7342 13.4425C10.7342 13.7421 10.896 13.9933 11.1781 14.1318L11.186 14.1357L11.194 14.1393C11.3365 14.2029 11.5387 14.2642 11.8305 14.3322C12.1322 14.4004 12.3838 14.4785 12.5815 14.5651L12.5856 14.5669L12.5897 14.5686C12.7365 14.6297 12.8624 14.7317 12.9746 14.8805L12.9764 14.8828L12.9782 14.8852C13.0763 15.012 13.1261 15.2081 13.1261 15.4681C13.1261 15.7682 13.0392 16.0222 12.8604 16.2447C12.7053 16.4377 12.4888 16.5713 12.1983 16.6531C11.974 16.7163 11.8 16.8878 11.7255 17.1019Z"
                                            fill="#000000"></path>
                                        <path
                                            d="M11.9785 18H11.497C11.3893 18 11.302 17.9105 11.302 17.8V17.3985C11.302 17.2929 11.2219 17.2061 11.1195 17.1944C10.8757 17.1667 10.6399 17.115 10.412 17.0394C10.1906 16.9648 9.99879 16.8764 9.83657 16.7739C9.76202 16.7268 9.7349 16.6312 9.76572 16.5472L10.096 15.6466C10.1405 15.5254 10.284 15.479 10.3945 15.5417C10.5437 15.6262 10.7041 15.6985 10.8755 15.7585C11.131 15.8429 11.3762 15.8851 11.611 15.8851C11.8129 15.8851 11.9572 15.8628 12.0437 15.8181C12.1302 15.7684 12.1735 15.6964 12.1735 15.6021C12.1735 15.4929 12.1158 15.411 12.0004 15.3564C11.8892 15.3018 11.7037 15.2422 11.4442 15.1777C11.1104 15.0933 10.8323 15.0039 10.6098 14.9096C10.3873 14.8103 10.1936 14.6514 10.0288 14.433C9.86396 14.2096 9.78156 13.9092 9.78156 13.5319C9.78156 13.095 9.91136 12.7202 10.1709 12.4074C10.4049 12.13 10.7279 11.9424 11.1401 11.8447C11.2329 11.8227 11.302 11.7401 11.302 11.6425V11.2C11.302 11.0895 11.3893 11 11.497 11H11.9785C12.0862 11 12.1735 11.0895 12.1735 11.2V11.6172C12.1735 11.7194 12.2487 11.8045 12.3471 11.8202C12.7082 11.8777 13.0255 11.9866 13.2989 12.1469C13.3765 12.1924 13.4073 12.2892 13.3775 12.3756L13.0684 13.2725C13.0275 13.3914 12.891 13.4417 12.7812 13.3849C12.433 13.2049 12.1007 13.1149 11.7841 13.1149C11.4091 13.1149 11.2216 13.2241 11.2216 13.4425C11.2216 13.5468 11.2773 13.6262 11.3885 13.6809C11.4998 13.7305 11.6831 13.7851 11.9386 13.8447C12.2682 13.9192 12.5464 14.006 12.773 14.1053C12.9996 14.1996 13.1953 14.356 13.3602 14.5745C13.5291 14.7929 13.6136 15.0908 13.6136 15.4681C13.6136 15.8851 13.4879 16.25 13.2365 16.5628C13.0176 16.8354 12.7145 17.0262 12.3274 17.1353C12.2384 17.1604 12.1735 17.2412 12.1735 17.3358V17.8C12.1735 17.9105 12.0862 18 11.9785 18Z"
                                            fill="#000000"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M9.59235 5H13.8141C14.8954 5 14.3016 6.664 13.8638 7.679L13.3656 8.843L13.2983 9C13.7702 8.97651 14.2369 9.11054 14.6282 9.382C16.0921 10.7558 17.2802 12.4098 18.1256 14.251C18.455 14.9318 18.5857 15.6958 18.5019 16.451C18.4013 18.3759 16.8956 19.9098 15.0182 20H8.38823C6.51033 19.9125 5.0024 18.3802 4.89968 16.455C4.81587 15.6998 4.94656 14.9358 5.27603 14.255C6.12242 12.412 7.31216 10.7565 8.77823 9.382C9.1696 9.11054 9.63622 8.97651 10.1081 9L10.0301 8.819L9.54263 7.679C9.1068 6.664 8.5101 5 9.59235 5Z"
                                            stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path
                                            d="M13.2983 9.75C13.7125 9.75 14.0483 9.41421 14.0483 9C14.0483 8.58579 13.7125 8.25 13.2983 8.25V9.75ZM10.1081 8.25C9.69391 8.25 9.35812 8.58579 9.35812 9C9.35812 9.41421 9.69391 9.75 10.1081 9.75V8.25ZM15.9776 8.64988C16.3365 8.44312 16.4599 7.98455 16.2531 7.62563C16.0463 7.26671 15.5878 7.14336 15.2289 7.35012L15.9776 8.64988ZM13.3656 8.843L13.5103 9.57891L13.5125 9.57848L13.3656 8.843ZM10.0301 8.819L10.1854 8.08521L10.1786 8.08383L10.0301 8.819ZM8.166 7.34357C7.80346 7.14322 7.34715 7.27469 7.1468 7.63722C6.94644 7.99976 7.07791 8.45607 7.44045 8.65643L8.166 7.34357ZM13.2983 8.25H10.1081V9.75H13.2983V8.25ZM15.2289 7.35012C14.6019 7.71128 13.9233 7.96683 13.2187 8.10752L13.5125 9.57848C14.3778 9.40568 15.2101 9.09203 15.9776 8.64988L15.2289 7.35012ZM13.2209 8.10709C12.2175 8.30441 11.1861 8.29699 10.1854 8.08525L9.87486 9.55275C11.0732 9.80631 12.3086 9.81521 13.5103 9.57891L13.2209 8.10709ZM10.1786 8.08383C9.47587 7.94196 8.79745 7.69255 8.166 7.34357L7.44045 8.65643C8.20526 9.0791 9.02818 9.38184 9.88169 9.55417L10.1786 8.08383Z"
                                            fill="#000000"></path>
                                    </g>
                                </svg> </v-col>
                            <v-col>
                                <v-card-title>Reward Management</v-card-title>
                                <v-card-subtitle class="overflow-x-hidden">
                                    <v-divider vertical thickness="20px"></v-divider>
                                    View All rewards and Make New Rewards for Students to Buy
                                </v-card-subtitle>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>