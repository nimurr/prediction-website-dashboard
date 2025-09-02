import { useGetPrivacyPolicyQuery } from "../../redux/features/setting/settingApi";

const PrivacyPolicy = () => {

    const { data } = useGetPrivacyPolicyQuery();
    console.log(data);

    return (
        <div>
            <h1>Privacy Policy</h1>
        </div>
    )
}

export default PrivacyPolicy
