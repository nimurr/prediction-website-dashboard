import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ReviewsAllAddReview = () => {
    const [formData, setFormData] = useState({
        image: "",
        bonusTitle: "",
        freeSpinsBonus: "",
        lastUpdateDate: "",
        adminAvgRating: "",
        userAvgRating: "",
        summaryTitle: "",
        allInfo: [{ heading: "", description: "" }],
        positiveSide: [{ heading: "" }],
        negativeSide: [{ heading: "" }],
    });

    // ==================== BASIC INPUTS ====================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ==================== ALL INFO ====================
    const handleInfoChange = (index, e) => {
        const { name, value } = e.target;
        const updatedInfo = [...formData.allInfo];
        updatedInfo[index][name] = value;
        setFormData({ ...formData, allInfo: updatedInfo });
    };

    const addInfoField = () => {
        setFormData({
            ...formData,
            allInfo: [...formData.allInfo, { heading: "", description: "" }],
        });
    };

    const removeInfoField = (index) => {
        const updatedInfo = [...formData.allInfo];
        updatedInfo.splice(index, 1);
        setFormData({ ...formData, allInfo: updatedInfo });
    };

    // ==================== POSITIVE SIDE ====================
    const handlePositiveSideChange = (index, e) => {
        const { value } = e.target;
        const updatedPositiveSide = [...formData.positiveSide];
        updatedPositiveSide[index].heading = value;
        setFormData({ ...formData, positiveSide: updatedPositiveSide });
    };

    const addPositiveSide = () => {
        setFormData({
            ...formData,
            positiveSide: [...formData.positiveSide, { heading: "" }],
        });
    };

    const removePositiveSide = (index) => {
        const updatedPositiveSide = [...formData.positiveSide];
        updatedPositiveSide.splice(index, 1);
        setFormData({ ...formData, positiveSide: updatedPositiveSide });
    };
    // ==================== NEGATIVE SIDE ====================
    const handleNegativeSideChange = (index, e) => {
        const { value } = e.target;
        const updatedNegativeSide = [...formData.negativeSide];
        updatedNegativeSide[index].heading = value;
        setFormData({ ...formData, negativeSide: updatedNegativeSide });
    };
    const addNegativeSide = () => {
        setFormData({
            ...formData,
            negativeSide: [...formData.negativeSide, { heading: "" }],
        });
    };

    const removeNegativeSide = (index) => {
        const updatedNegativeSide = [...formData.negativeSide];
        updatedNegativeSide.splice(index, 1);
        setFormData({ ...formData, negativeSide: updatedNegativeSide });
    };

    // ==================== SUBMIT ====================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/reviews", formData);
            alert("Review added successfully!");
            setFormData({
                image: "",
                bonusTitle: "",
                freeSpinsBonus: "",
                lastUpdateDate: "",
                adminAvgRating: "",
                userAvgRating: "",
                summaryTitle: "",
                allInfo: [{ heading: "", description: "" }],
                positiveSide: [{ heading: "" }],
            });
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Failed to add review.");
        }
    };

    return (
        <div>
            <Link to="/reviews-all" className="bg-blue-500 text-white hover:bg-blue-600 px-5 py-2 inline-block rounded mt-4 ml-4">
                &larr; Back to Reviews
            </Link>
            <div className="max-w-3xl mx-auto p-6 my-10 bg-gray-100 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Add New Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="text"
                        name="bonusTitle"
                        placeholder="Bonus Title"
                        value={formData.bonusTitle}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="text"
                        name="freeSpinsBonus"
                        placeholder="Free Spins Bonus"
                        value={formData.freeSpinsBonus}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="lastUpdateDate"
                        value={formData.lastUpdateDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="number"
                        step="0.1"
                        name="adminAvgRating"
                        placeholder="Admin Avg Rating"
                        value={formData.adminAvgRating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="number"
                        step="0.1"
                        name="userAvgRating"
                        placeholder="User Avg Rating"
                        value={formData.userAvgRating}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="summaryTitle"
                        placeholder="Summary Title"
                        value={formData.summaryTitle}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    {/* ================= ALL INFO ================= */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">All Info</h3>
                        {formData.allInfo.map((info, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    name="heading"
                                    placeholder="Heading"
                                    value={info.heading}
                                    onChange={(e) => handleInfoChange(index, e)}
                                    className="w-1/3 border p-2 rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={info.description}
                                    onChange={(e) => handleInfoChange(index, e)}
                                    className="w-2/3 border p-2 rounded"
                                    required
                                />
                                {formData.allInfo.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInfoField(index)}
                                        className="bg-red-500 text-white px-2 rounded"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addInfoField}
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                        >
                            + Add Info
                        </button>
                    </div>

                    {/* ================= POSITIVE SIDE ================= */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Positive Side</h3>
                        {formData.positiveSide.map((info, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Positive point"
                                    value={info.heading}
                                    onChange={(e) => handlePositiveSideChange(index, e)}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                                {formData.positiveSide.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePositiveSide(index)}
                                        className="bg-red-500 text-white px-2 rounded"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addPositiveSide}
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                        >
                            + Add Positive Side
                        </button>
                    </div>
                    {/* NEGATIVE SIDE */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Negative Side</h3>
                        {formData.negativeSide.map((info, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Negative point"
                                    value={info.heading}
                                    onChange={(e) => handleNegativeSideChange(index, e)}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                                {formData.negativeSide.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeNegativeSide(index)}
                                        className="bg-red-500 text-white px-2 rounded"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNegativeSide}
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                        >
                            + Add Negative Side
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#704AAA] text-white py-2 rounded hover:bg-[#7043b4] transition-colors"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewsAllAddReview;
