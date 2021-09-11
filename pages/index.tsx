import Head from 'next/head';
import styles from '../styles/Home.module.css';

const TennisMap = dynamic(() => import('../components/TennisMap'), { ssr: false });

export default function Home() {
    return (
        <div>
            <TennisMap />
        </div>
    );
}
