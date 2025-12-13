from unittest.mock import patch, MagicMock

from bot_connectors.service.client.vault_client import VaultClient


@patch("bot_connectors.service.client.vault_client.hvac.Client")
def test_should_have_refreshed_expired_token(client_mock):
    # given
    client_mock.auth_approle.login.return_value = dict({
        'auth': {'client_token': 'test_token', 'lease_duration': 10.0}
    })
    client_mock.read.return_value = {'data': {'username': 'user', 'password': 'pass'}}
    client = VaultClient("http://test.address:8200", "role_id", "secret_id")

    # when
    creds = client.get_db_creds('test_role')

    # then
    assert client_mock.auth_approle.login.call_count == 2  # second time for refreshing
    assert creds['username'] == 'user'
    assert creds['password'] == 'pass'
