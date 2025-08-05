import pytest


@pytest.fixture(scope="function")
def setup_ld_library_path():
    """Set up the LD_LIBRARY_PATH environment variable."""
    import os
    from dotenv import load_dotenv

    env_path = os.path.join(
        os.path.dirname(__file__), "..", "conf", "local.env"
    )
    original_ld_path = os.environ.get("LD_LIBRARY_PATH")
    print("before test, LD_LIBRARY_PATH is:", original_ld_path)
    load_dotenv(dotenv_path=env_path, verbose=True)
    print("LD_LIBRARY_PATH set to:", os.environ.get("LD_LIBRARY_PATH"))

    yield  # Run the test

    # Teardown: clean up the env variable if it was added
    if "LD_LIBRARY_PATH" in os.environ:
        del os.environ["LD_LIBRARY_PATH"]

    # Optionally restore the original value if needed
    if original_ld_path is not None:
        os.environ["LD_LIBRARY_PATH"] = original_ld_path
