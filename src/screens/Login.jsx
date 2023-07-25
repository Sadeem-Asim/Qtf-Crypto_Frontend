import {imageURL, useCookie} from "hooks";
import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";
import {apis} from "../services";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../redux/slices/user.slice";

export default function Login() {
    const dipatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const {user: _user} = useSelector(store => store.user)


    const {mutateAsync, isLoading} = useMutation(apis.authenticate, {
        onError: (error) => toast.error(error.message),
        onSuccess: ({data: user, status, headers}) => {
            if (status === 200) {
                const token = headers['x-auth-token'];
                dipatch(setUser({...user, token}));
                toast.success('Successfully Logged-in')

                /*if (user?.role === "USER") navigate('/user/dashboard');
                else navigate('/');*/
            }
        }
    });


    useEffect(() => {
        if (_user) {
            switch (_user.role) {
                case "ADMIN":
                    navigate('/');
                    break;
                case "SUB_ADMIN":
                    navigate('/sub_admin/activity');
                    break;
                case "USER":
                    navigate('/user/dashboard')
                    break;
                default:
                    navigate('/')
            }
        }
    }, [_user]);


    const onSubmitHandler = async (e) => {
        e.preventDefault();
        await mutateAsync({email, password})
    }

    return <>
        <main className="login-main w-100">
            <div className="custom-form center-form">
                <Form onSubmit={onSubmitHandler}>
                    {/* <h3 className="section-title text-center">Crypto Bot</h3> */}
                    <div className="form-logo-main">
                        <img src={imageURL('logo.png')} alt=""/>
                    </div>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" className="custom-input" placeholder="Email" value={email}
                                      onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" className="custom-input" placeholder="Password" value={password}
                                      onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                    <div>
                        <button className="custom-btn primary-btn" type='submit' disabled={isLoading}>
                            {isLoading ? 'Logging' : 'Login'}
                        </button>
                        {/*<button className="custom-btn text-white bg-transparent border-0 text-decoration-underline"
                                onClick={() => navigate('/registration')}
                                style={{marginLeft: '15px'}}>
                            Register
                        </button>*/}
                    </div>
                </Form>
            </div>
        </main>
    </>
}
