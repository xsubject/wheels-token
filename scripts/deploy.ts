import { ethers } from "hardhat";

async function main() {
    const token = await ethers.deployContract("WheelsToken", [
        "100000",
        "0xAB7c603453FC9D41E9E75C62e8587BB78a1bE50C",
        "0xd99d1c33f9fc3444f8101754abc46c52416550d1",
    ]);

    await token.waitForDeployment();

    console.log(`Token with deployed to ${token.target}`);

    const cake = await ethers.getContractAt(
        "IERC20",
        "0x8d008B313C1d6C7fE2982F62d32Da7507cF43551"
    );

    const router = await ethers.getContractAt(
        "IUniswapV2Router02",
        "0xd99d1c33f9fc3444f8101754abc46c52416550d1"
    );
    await token.approve(router.target, "1000000000000000000000000");
    {
        const tx = await cake.approve(
            router.target,
            "10000000000000000000000000"
        );
        await tx.wait(3);
    }
    {
        const tx = await router.addLiquidity(
            token.target,
            cake.target,
            "1000000000000000000",
            "1000000000000000000",
            "1",
            "1",
            "0xAB7c603453FC9D41E9E75C62e8587BB78a1bE50C",
            "9999999999999"
        );
        await tx.wait(2);
        console.log(`Liquidity added on ${tx.hash}`);
    }
    {
        const tx = await token.setOtherToken(cake.target);
        await tx.wait(2);
    }
    {
        console.log(`Swapping...`);
        const tx =
            await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                "100000000",
                "1000",
                [token.target, cake.target],
                "0xAB7c603453FC9D41E9E75C62e8587BB78a1bE50C",
                "9999999999999999"
            );
        console.log(`Sended tx ${tx.hash}`);
        await tx.wait(2);
    }
    {
        console.log(`send tx...`);
        const tx = await token.transfer(
            "0xAB7c603453FC9D41E9E75C62e8587BB78a1bE50C",
            "1"
        );
        console.log(`Sended tx ${tx.hash}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
