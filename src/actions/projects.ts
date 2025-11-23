// import { z } from "zod";
// import { projectsFormSchema } from "../schemas";
// import axios from "axios";

// const projectsFormSubmit = async (
//   values: z.infer<typeof projectsFormSchema>
// ) => {
//   const {
//     description,
//     websiteLink,
//     githubLink,
//     aim,
//     projectDetails,
//     challenges,
//     typeOfProject,
//     projectTitle,
//   } = values;

//   const response = await axios.post(
//     "/api/projects",
//     {
//       projectTitle,
//       aim,
//       projectDetails,
//       challenges,
//       typeOfProject,
//       websiteLink,
//       githubLink,
//       description,
//     },
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   const data = response.data;
//   return data;
// };

// export default projectsFormSubmit;
