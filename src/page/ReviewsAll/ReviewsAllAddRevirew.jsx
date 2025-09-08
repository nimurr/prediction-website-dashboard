import { useState } from "react";
import { Link } from "react-router-dom";
import { useCreateNewSectionReviewMutation, useCreateReviewAllMutation, useHandleChangeImageMutation } from "../../redux/features/reviews/reviews";
import { message } from "antd";
import { imageBaseUrl } from "../../config/imageBaseUrl";

const ReviewsAllAddReview = () => {
    const [formData, setFormData] = useState({
        image: "",
        bonusTitle: "",
        casinoLink: "",
        freeSpinsBonus: "",
        lastUpdateDate: "",
        adminAvgRating: "",
        summaryTitle: "",
        allInfo: [{ title: "", subTitle: "" }],
        positiveSide: [{ heading: "" }],
        negativeSide: [{ heading: "" }],
        extraSections: [], // Saved Extra Sections
    });

    const [extraFields, setExtraFields] = useState([]); // Input fields only

    const [createNewReviewSecitonInfo] = useCreateNewSectionReviewMutation();
    const [createReviewMin] = useCreateReviewAllMutation();

    // ==================== BASIC INPUTS ====================
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const [upalodImage] = useHandleChangeImageMutation();

    const handleChangeImage = async (e) => {
        const file = e.target.files[0]; // selected file
        if (!file) return;

        try {
            const formDataImg = new FormData();
            formDataImg.append("image", file);
            const res = await upalodImage(formDataImg).unwrap(); // Redux Toolkit Query
            const imageUrl = res?.data?.image; // assume backend returns { data: { url: "..." } }

            console.log(imageUrl)

            // set uploaded image URL in formData
            setFormData((prev) => ({
                ...prev,
                image: imageUrl
            }));

            message.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Image upload failed:", error);
            message.error("Image upload failed.");
        }
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
            allInfo: [...formData.allInfo, { title: "", subTitle: "" }],
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

    // ==================== EXTRA FIELDS ====================
    const handleExtraChange = (index, e) => {
        const { name, value, files } = e.target;
        const updated = [...extraFields];
        updated[index][name] = name === "image" ? files[0] : value;
        setExtraFields(updated);
    };
    const addExtraField = () => {
        setExtraFields([...extraFields, { description: "", image: null }]);
    };
    const saveExtraField = async (index) => {
        const current = extraFields[index];
        const formdata = new FormData();
        formdata.append("description", current.description);
        formdata.append("image", current.image);

        try {
            const res = await createNewReviewSecitonInfo(formdata);
            const saved = {
                description: res?.data?.data?.description,
                image: res?.data?.data?.image,
            };
            console.log(res);

            setFormData((prev) => ({
                ...prev,
                extraSections: [...prev.extraSections, saved],
            }));

            const updated = [...extraFields];
            updated.splice(index, 1);
            setExtraFields(updated);

            message.success("Extra section saved!");
        } catch (error) {
            console.error("Error saving extra section:", error);
            message.error("Failed to save extra section.");
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const data = new FormData();
    //         // data.append("image", formData.image);
    //         data.append("bonusTitle", formData.bonusTitle);
    //         data.append("freeSpinsBonus", formData.freeSpinsBonus);
    //         data.append("lastUpdateDate", formData.lastUpdateDate);
    //         data.append("adminAvgRating", formData.adminAvgRating);
    //         data.append("summaryTitle", formData.summaryTitle);

    //         // Arrays as JSON blobs
    //         data.append("allInfo", new Blob([JSON.stringify(formData.allInfo)], { type: "application/json" }));
    //         data.append("positivesSides", new Blob([JSON.stringify(formData.positiveSide.map(p => p.heading))], { type: "application/json" }));
    //         data.append("negativesSides", new Blob([JSON.stringify(formData.negativeSide.map(n => n.heading))], { type: "application/json" }));
    //         data.append("otherAllInfoTitleDescriptionImage", new Blob([JSON.stringify(formData.extraSections.map(s => ({ description: s.description })))], { type: "application/json" }));

    //         // Append extra section images
    //         formData.extraSections.forEach((section) => {
    //             if (section.image) {
    //                 data.append("extraImages", section.image);
    //             }
    //         });

    //         console.log(formData)

    //         const res = await createReviewMin(data);
    //         console.log(res);
    //         message.success("Review added successfully!");
    //     } catch (error) {
    //         console.error("Error adding review:", error);
    //         message.error("Failed to add review.");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                image: formData.image,
                casinoLink: formData.casinoLink,
                bonusTitle: formData.bonusTitle || null,
                freeSpinsBonus: formData.freeSpinsBonus || null,
                lastUpdateDate: formData.lastUpdateDate || null,
                adminAvgRating: formData.adminAvgRating || null,
                summaryTitle: formData.summaryTitle || null,
                allInfo: formData.allInfo || [],
                positivesSides: formData.positiveSide.map(p => p.heading) || [],
                negativesSides: formData.negativeSide.map(n => n.heading) || [],
                otherAllInfoTitleDescriptionImage: formData.extraSections.map(s => ({
                    description: s.description || null,
                    image: s.image || null
                }))
            };
            console.log(data);

            const res = await createReviewMin(data).unwrap();

            console.log(res);


            if (res.status) {
                message.success("Review added successfully!");
                setTimeout(() => {
                    // window.location.reload()
                }, 2000)
            }
            else {
                message.error("Faild to submit Please try again")
            }
        } catch (error) {
            console.error("Error adding review:", error);
            message.error("Failed to add review.");
        }
    };


    return (
        <div>
            <Link
                to="/reviews-all"
                className="bg-blue-500 text-white hover:bg-blue-600 px-5 py-2 inline-block rounded mt-4 ml-4"
            >
                &larr; Back to Reviews
            </Link>
            <div className="max-w-3xl mx-auto p-6 my-10 bg-gray-100 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Add New Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* BASIC INPUTS */}
                    <input type="file" name="image" onChange={handleChangeImage} className="w-full border p-2 rounded" required />
                    <input type="text" name="casinoLink" placeholder="Open Url" value={formData.casinoLink} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input type="text" name="bonusTitle" placeholder="Bonus Title" value={formData.bonusTitle} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input type="text" name="freeSpinsBonus" placeholder="Free Spins Bonus" value={formData.freeSpinsBonus} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="date" name="lastUpdateDate" value={formData.lastUpdateDate} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input type="number" step="0.1" name="adminAvgRating" placeholder="Admin Avg Rating" onChange={handleChange} className="w-full border p-2 rounded" />
                    <input type="text" name="summaryTitle" placeholder="Summary Title" value={formData.summaryTitle} onChange={handleChange} className="w-full border p-2 rounded" required />

                    {/* ALL INFO */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">All Info</h3>
                        {formData.allInfo.map((info, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input type="text" name="title" placeholder="title" value={info.title} onChange={(e) => handleInfoChange(index, e)} className="w-1/3 border p-2 rounded" required />
                                <input type="text" name="subTitle" placeholder="subTitle" value={info.subTitle} onChange={(e) => handleInfoChange(index, e)} className="w-2/3 border p-2 rounded" required />
                                {formData.allInfo.length > 1 && (
                                    <button type="button" onClick={() => removeInfoField(index)} className="bg-red-500 text-white px-2 rounded">✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addInfoField} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Info</button>
                    </div>

                    {/* POSITIVE SIDE */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Positive Side</h3>
                        {formData.positiveSide.map((info, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input type="text" placeholder="Positive point" value={info.heading} onChange={(e) => handlePositiveSideChange(index, e)} className="w-full border p-2 rounded" required />
                                {formData.positiveSide.length > 1 && (
                                    <button type="button" onClick={() => removePositiveSide(index)} className="bg-red-500 text-white px-2 rounded">✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addPositiveSide} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Positive Side</button>
                    </div>

                    {/* NEGATIVE SIDE */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Negative Side</h3>
                        {formData.negativeSide.map((info, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input type="text" placeholder="Negative point" value={info.heading} onChange={(e) => handleNegativeSideChange(index, e)} className="w-full border p-2 rounded" required />
                                {formData.negativeSide.length > 1 && (
                                    <button type="button" onClick={() => removeNegativeSide(index)} className="bg-red-500 text-white px-2 rounded">✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addNegativeSide} className="bg-blue-500 text-white px-4 py-1 rounded">+ Add Negative Side</button>
                    </div>

                    {/* EXTRA FIELDS */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Extra Fields</h3>

                        {/* Saved Sections */}
                        {formData.extraSections.length > 0 && formData.extraSections.map((item, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded mb-3 flex flex-col md:flex-row gap-4 items-center">
                                <div className="flex-1">
                                    <p className="font-semibold mb-2">Description:</p>
                                    <p>{item.description}</p>
                                </div>
                                {item.image && (
                                    <div className="flex-1">
                                        <p className="font-semibold mb-2">Image:</p>
                                        <img src={imageBaseUrl + item.image} alt={`extra-${index}`} className="max-h-32 object-contain" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Input fields */}
                        {extraFields.map((extra, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded-lg mb-2">
                                <label>
                                    <span>Description </span>
                                    <textarea rows={5} className="p-2 rounded-lg border-2 border-gray-400 w-full my-2" placeholder="Enter your Description ..." name="description" value={extra.description} onChange={(e) => handleExtraChange(index, e)} />
                                </label>
                                <label>
                                    <span>Image</span>
                                    <input className="p-2 rounded-lg border-2 border-gray-400 w-full my-2" type="file" name="image" onChange={(e) => handleExtraChange(index, e)} />
                                </label>
                                <button type="button" onClick={() => saveExtraField(index)} className="bg-[#704AAA] py-2 px-8 rounded-lg text-white">Save</button>
                            </div>
                        ))}
                        <button type="button" onClick={addExtraField} className="block rounded-lg w-full bg-blue-600 text-white py-2 text-base">+ Add New</button>
                    </div>

                    <button type="submit" className="w-full bg-[#704AAA] text-white py-2 rounded hover:bg-[#7043b4] transition-colors">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default ReviewsAllAddReview;
