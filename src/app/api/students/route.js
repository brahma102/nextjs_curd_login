import { NextResponse } from "next/server";
import Connection from '@/database/config';
import Student from "@/models/student";

export async function GET() {
    await Connection();
    try {
        const students = await Student.find({}, "name phone");
        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching students" }, { status: 500 });
    }
}

export async function POST(req) {
    await Connection();
    try {
        const { name, phone } = await req.json();
        if (!name || !phone) {
            return NextResponse.json({ message: "Name and phone are required" }, { status: 400 });
        }

        const newStudent = await Student.create({ name, phone });
        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        console.error(error); // Log the error to get more details
        return NextResponse.json({ message: "Error creating student" }, { status: 500 });
    }
}
