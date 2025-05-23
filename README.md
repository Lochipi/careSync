# CareSync

A health information system built with **Next.js**, **tRPC**, **Supabase**, and **shadcn/ui**.  
CareSync allows doctors to **manage health programs** and **client enrollments**, with **API-first** access to client profiles.

---

## Features

- Create and manage **health programs** (e.g., HIV, TB, Malaria)
- Register and manage **clients**
- Enroll clients into **multiple health programs**
- **Search** and **view** client profiles
- Expose **public API** access to client profiles
- **Responsive UI** 

---

## Tech stack

- **Frontend**: Next.js, Shadcn (for components), Tailwind CSS (for styling)
- **Backend**: API integrated using tRPC
- **Database**: Prisma with PostgreSQL on Supabase
- **Image Handling**: UploadThing (S3-style uploads)
- **Form Handling**: React hook Forms + Zod validation
- **State Management & Caching**: React Query

---

## API-First design

- Modular API endpoints with tRPC 
- Data validation with Zod at both client and server 

---

## Security considerations

- Supabase **Row-Level Security (RLS)** policies enforced 
- Strict input validation using Zod
- HTTPS enforced assumption for all external access
- Minimal exposure of sensitive data in public APIs

---

## Innovations & Optimizations

- **Optimistic UI updates** with React Query for snappy experience
- **Serverless database** architecture using Supabase
- **Type safety end-to-end** using Prisma, tRPC, and Zod
- **Cloud-ready**: deployed to Vercel platform

---

## Deployment

- Deployment-ready for platforms like **Vercel**, **Netlify**, or **Supabase Edge Functions** 

---

## Submission links

- 🔗 **[GitHub repository](https://github.com/Lochipi/careSync)**  
- 🔗 **[Project live link](https://caresync-omega.vercel.app/)**
- 📊 **[Presentation link](https://docs.google.com/presentation/d/1P1vcImjO43LB9x8MVe_g2HnQG3Dm8qAbFvUnINYVXKM/edit?usp=sharing)**
---

## Known issues

- None currently.
- Open for iterative improvements post-evaluation.

---

## Future plans

- **Add authentication**: Add role-based access (Admin, Doctor, Nurse).
- **Activity logs**: Track changes like enrollments, program updates, etc. 
- **Notifications**: Email or in-app notifications for client updates.
- **Testing**: Add integration and unit tests (Jest + Testing Library). 
- **Mobile responsiveness**: Improve mobile view UX even further. 
- **Archiving**: Ability to archive inactive clients without permanent deletion.

---

# Screenshots
![image](https://github.com/user-attachments/assets/9cbff0af-3b1e-42aa-bd50-a8141919f9f4)
![image](https://github.com/user-attachments/assets/f7e795ed-989f-4428-9568-d53af0000e7e)
![image](https://github.com/user-attachments/assets/b8dff178-92d5-498e-a5c0-27edabdcffc7)

![image](https://github.com/user-attachments/assets/9bb232c1-1ecf-44f7-9049-9af3c87a4f68)

![image](https://github.com/user-attachments/assets/e39deb45-401f-42db-a3a5-445211629ca5)

![image](https://github.com/user-attachments/assets/11bff451-cbe3-46bf-8467-b32ac405d555)


![image](https://github.com/user-attachments/assets/03357758-3893-438d-a05b-15b58a37dd64)

![image](https://github.com/user-attachments/assets/71cb28c0-4805-41d6-9160-57251cada9af)
![image](https://github.com/user-attachments/assets/8d99f90c-0e4a-4f7e-a8b2-d047f712741f)


---

# Bonus ideas I have in mind (post-submission)

- **CI/CD pipelines** with GitHub Actions
- **Dockerization** for easy setup across teams

---

## Note

I followed an **API-first approach** by designing the backend logic first and treating the frontend as just a consumer of the API.  
Even though I used **tRPC** (not traditional REST), the principle still applies — server routes are defined clearly, type-safe, and consumed directly by the client without manual fetches.  
This keeps the system modular, clean, and scalable.

### Public API Exposure

Yes, I exposed **client profile data** through a public API endpoint using tRPC.  
This means external systems can access specific client information safely.  
I kept the structure flexible so that adding auth, permissions, or rate limits in the future will be straightforward. 

---

