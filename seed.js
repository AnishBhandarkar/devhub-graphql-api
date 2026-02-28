require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Developer = require("./src/modules/developer/developer.model");
const Project = require("./src/modules/project/project.model");

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding 🌱");
}

async function clearDatabase() {
    await Developer.deleteMany();
    await Project.deleteMany();
    console.log("Existing data cleared 🧹");
}

async function seedDevelopers() {

    const passwordHash = await bcrypt.hash("password123", 10);

    const developers = await Developer.insertMany([
        {
            name: "Anish",
            email: "anish@example.com",
            password: passwordHash,
            bio: "Fullstack developer building scalable apps",
            skills: ["JavaScript", "React", "Node.js", "GraphQL"],
            avatarUrl: "https://i.pravatar.cc/150?img=1"
        },
        {
            name: "John",
            email: "john@example.com",
            password: passwordHash,
            bio: "Backend engineer and database expert",
            skills: ["Node.js", "MongoDB", "Docker"],
            avatarUrl: "https://i.pravatar.cc/150?img=2"
        },
        {
            name: "Sarah",
            email: "sarah@example.com",
            password: passwordHash,
            bio: "Frontend wizard and UX enthusiast",
            skills: ["React", "TypeScript", "CSS"],
            avatarUrl: "https://i.pravatar.cc/150?img=3"
        }
    ]);

    console.log("Developers seeded 👨‍💻");

    return developers;
}

async function seedProjects(developers) {

    const projects = await Project.insertMany([
        {
            title: "DevHub GraphQL API",
            description: "Social platform API for developers",
            technologies: ["Node.js", "GraphQL", "MongoDB"],
            repositoryUrl: "https://github.com/example/devhub",
            developer: developers[0]._id
        },
        {
            title: "Realtime Chat App",
            description: "Socket.io based chat application",
            technologies: ["Node.js", "Socket.io"],
            repositoryUrl: "https://github.com/example/chat",
            developer: developers[1]._id
        },
        {
            title: "Portfolio Website",
            description: "Modern portfolio built with React",
            technologies: ["React", "Tailwind"],
            repositoryUrl: "https://github.com/example/portfolio",
            developer: developers[2]._id
        }
    ]);

    console.log("Projects seeded 🚀");

    return projects;
}

async function seedFollows(developers) {

    const [anish, john, sarah] = developers;

    anish.following.push(john._id, sarah._id);
    john.followers.push(anish._id);

    sarah.followers.push(anish._id);

    await anish.save();
    await john.save();
    await sarah.save();

    console.log("Follow relationships seeded 🤝");
}

async function seedStars(projects, developers) {

    projects[0].stars.push(developers[1]._id, developers[2]._id);

    await projects[0].save();

    console.log("Project stars seeded ⭐");
}

async function seed() {

    try {

        await connectDB();

        await clearDatabase();

        const developers = await seedDevelopers();

        const projects = await seedProjects(developers);

        await seedFollows(developers);

        await seedStars(projects, developers);

        console.log("Database seeded successfully 🌿");

    } catch (error) {

        console.error("Seeding failed ❌", error);

    } finally {

        await mongoose.disconnect();

        process.exit();

    }

}

seed();