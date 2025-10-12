import { ExamType } from "@/types/application";
import { Course, Semester } from "@/types/semester";
import { User } from "@/types/user";

export type KhaltiExamPaymentPayload = {
    return_url: string;
    website_url: string;
    amount: number;
    purchase_order_id: string;
    purchase_order_name: string;
    customer_info: {
        name: string;
        email: string;
        phone: string;
    };
    amount_breakdown: {
        label: string;
        amount: number;
    }[];
    product_details: {
        identity: string;
        name: string;
        total_price: number;
        quantity: number;
        unit_price: number;
    }[];
    merchant_username: string;
    merchant_extra: string;
};


export const BuildKhaltiExamPayload = (
    examType: ExamType,
    semester: Semester,
    selectedCourses: Course[],
    user: User,
): KhaltiExamPaymentPayload => {
    const purchaseOrderId = `exam-${user.id}-${Date.now()}`;

    const subtotal =
        examType === ExamType.Regular
            ? semester.fee
            : selectedCourses.reduce((sum, course) => sum + course.credit * 100, 0);

    const total = subtotal;
    const returnUrl = process.env.NEXT_PUBLIC_CLIENT_URL ?? window.location.origin;

    return {
        return_url: `${returnUrl}/student/success`,
        website_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}`,
        amount: Math.round(total * 100), // Convert to paisa
        purchase_order_id: purchaseOrderId,
        purchase_order_name: `${examType} Examination - ${semester.name}`,
        customer_info: {
            name: `${user.firstName} ${user.middleName ?? ""} ${user.lastName}`.trim(),
            email: user.email,
            phone: user.phoneNumber,
        },
        amount_breakdown: [
            { label: "Exam Fee", amount: Math.round(subtotal * 100) },
        ],
        product_details:
            examType === ExamType.Regular
                ? [
                    {
                        identity: semester.id.toString(),
                        name: `${semester.program.degree} ${semester.program.name} - ${semester.name}`,
                        total_price: Math.round(subtotal * 100),
                        quantity: 1,
                        unit_price: Math.round(subtotal * 100),
                    },
                ]
                : selectedCourses.map((course) => ({
                    identity: course.id.toString(),
                    name: `${course.code} - ${course.name}`,
                    total_price: Math.round(course.credit * 100 * 100),
                    quantity: 1,
                    unit_price: Math.round(course.credit * 100 * 100),
                })),
        merchant_username: "examination_office",
        merchant_extra: `examType=${examType}&semesterId=${semester.id}`,
    };
};