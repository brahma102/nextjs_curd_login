import { NextResponse } from "next/server";
import Connection from '@/database/config';
import Student from "@/models/student";

export async function PUT(req, { params }) {
    await Connection();
    try {
        const { id } = params;
        const { name, phone } = await req.json();
        if (!name || !phone) {
            return NextResponse.json({ message: "Name and phone are required" }, { status: 400 });
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, { name, phone }, { new: true });
        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating student" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await Connection();
    try {
        const { id } = params;
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting student" }, { status: 500 });
    }
}
